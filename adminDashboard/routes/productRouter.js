const express =require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../model/product');
const userModel = require('../model/user');
const isAdmin = require('../middlewares/adminMiddleware');
const { route } = require('./userRouter');
const isAuthenticate = require('../middlewares/authMiddleware');
 const getProduct = require('../utils/getProduct');

router.get('/admindomain' , isAdmin, async (req, res)=>{
  const products = await productModel.find();
  res.render('adminDomain', {products});
});

router.get('/product/crud', isAdmin , async(req, res)=>{   
  const products = await productModel.find();
   const productData = await productModel.find();
    res.render('productList', {products, productData});
} )

router.get('/product/add', isAdmin, async (req, res)=>{
  
  res.render('productAdd');
})

router.post('/product/added',isAdmin, upload.array('image', 6), async (req, res) => {
  try {
    let colors = req.body.color;
    let colorArray = [];
    if (colors) {
    colorArray = colors.split(',').map(color => color.trim());
    }
    let tags = req.body.tag;
    let tagArray = [];
    if (tags) {
    tagArray = tags.split(',').map(tag => tag.trim());
    }
    const product = new productModel({
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      discount : req.body.discount,
      offer: req.body.offer,
      colors: colorArray,
      category: req.body.category,
      brand:req.body.brand,
      tag:tagArray,
      image: []
    });

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        product.image.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      });
    }

    await product.save();
    res.redirect('/product/crud');

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving product");
  }
});


router.post('/product/delete/:id', isAdmin ,async(req, res)=>{
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect('/product/crud');
} );


router.get('/product/edit/:id', isAdmin ,async(req, res)=>{
  const productId = req.params.id;
  const product = await productModel.findById(productId);
   res.render('productEdit', {product});
  
} )

router.post('/product/edited/:id', isAdmin, upload.array('image', 6), async (req, res) => {
  const productId = req.params.id;

   let tags = req.body.tag;
    let tagArray = [];
    if (tags) {
    tagArray = tags.split(',').map(tag => tag.trim());
    }

    let colors = req.body.color;
    let colorArray = [];
    if (colors) {
    colorArray = colors.split(',').map(color => color.trim());
    }

  try {
    const updateData = {
      productname: req.body.productname,
      description: req.body.description,
      colors: colorArray,
      price: req.body.price,
      rating: req.body.rating,
      discount: req.body.discount,
      offer: req.body.offer,
      category: req.body.category,
      brand:req.body.brand,
      tag:tagArray
    };

    // Add uploaded images if any
    if (req.files && req.files.length > 0) {
      updateData.image = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Update product in DB
    await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    res.redirect('/product/crud');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
});

router.post('/cart/add/:id', isAuthenticate, async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity) || 1;
  // 1. Capture the color sent from the frontend form
  const selectedColor = req.body.selectedColor; 

  try {
    const user = await userModel.findById(req.user.id);

    // 2. logic update: Find item by Product ID AND Color
    // If the user adds the same product but a different color, it should be a new entry
    const item = user.cart.find(i => 
      i.productId.toString() === productId && i.color === selectedColor
    );

    if (item) {
      // If product + specific color exists, just update quantity
      item.quantity += quantity;
    } else {
      // 3. If not, push new item WITH the color field
      user.cart.push({
        productId,
        quantity,
        color: selectedColor // Save the color to the schema
      });
    }

    await user.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to cart");
  }
});

router.get('/product/order',isAdmin, async(req, res)=>{
  const users = await userModel.find().populate('orders.productId');
    res.render('productOrder', {users});
})

// Add this route to productRouter.js to handle status updates
router.post('/admin/order/update/:userId/:orderId', isAdmin, async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        const { status } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send("User not found");

        const order = user.orders.id(orderId);
        if (!order) return res.status(404).send("Order not found");

        order.status = status;
        
        // If admin cancels, you could optionally add a default reason
        if (status === 'cancelled') {
            order.cancellationReason = "Cancelled by Admin";
        }

        await user.save();
        res.redirect('/product/order');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order status");
    }
});

router.post('/admin/order/update-group/:userId', async (req, res) => {
  const { userId } = req.params;
  const { status, orderTime } = req.body;

  const user = await User.findById(userId);

  user.orders.forEach(order => {
    if (new Date(order.orderDate).getTime() === Number(orderTime)) {
      order.status = status;
    }
  });

  await user.save();
  res.redirect('back');
});


router.get('/product/detail/:id', isAuthenticate, async(req, res)=>{
     try {
     const product = await productModel.findById(req.params.id) .populate({ path: 'reviews.userId', select: 'username email' });
  const user = await userModel.findById(req.user.id);
  const productData = await productModel.find({});
   const totalQuantity = new Set(
    user.cart.map(item => item.productId.toString() + "-" + item.color)
  ).size;

  
    const relatedProducts = await productModel.aggregate([
      {
        $match: {
          _id: { $ne: product._id },   // exclude the current product
          tag: { $in: product.tag }    // at least 1 matching tag
        }
      },
      {
        // Count how many tags are similar
        $addFields: {
          tagMatchCount: {
            $size: { $setIntersection: ["$tag", product.tag] }
          }
        }
      },
      {
        // Keep only products that share 2+ tags
        $match: {
          tagMatchCount: { $gte: 2 }
        }
      },
      {
        $sort: { tagMatchCount: -1 }   // optional: sort by most similar
      },
      { $limit: 10 }                   // show max 10 related products
    ]);
        res.render('productDetail', { product , productData, totalQuantity, relatedProducts});
    } catch (err) { 
        console.log(err);
        res.status(500).send("Error fetching product");
    }
})

router.post('/product/:id/review', isAuthenticate, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const userName = req.user.email;
  const { rating, comment } = req.body;

  try {
    // Find product normally (no populate on POST)
    const product = await productModel.findById(productId);

    if (!product) return res.status(404).send("Product not found");
    const currentUserId = req.user.id.toString();
    const userReviewedAlready = product.reviews.find(review => 
     review.userId.toString() === currentUserId
    );
    if (userReviewedAlready) {
  return res.status(400).send("You have already reviewed this product.");
  }
    // Add review correctly
    product.reviews.push({
      userName,
      userId,   // <-- correct field
      rating,
      comment
    });

    // Recalculate rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();

    res.redirect(`/product/detail/${productId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding review");
  }
});

router.get('/product/cart', isAuthenticate, async (req, res) => {
  const user = await userModel.findById(req.user.id);
  
  const mergedCart = {};

  // Merge by product + color
  user.cart.forEach(item => {
    const uniqueKey = `${item.productId}-${item.color}`;

    if (mergedCart[uniqueKey]) {
      mergedCart[uniqueKey].quantity += item.quantity;
    } else {
      mergedCart[uniqueKey] = {
        productId: item.productId,
        color: item.color,
        quantity: item.quantity
      };
    }
  });

  const products = [];

  for (const key in mergedCart) {
    const { productId, color, quantity } = mergedCart[key];
    const product = await productModel.findById(productId);

    if (product) {
      products.push({
        ...product._doc,
        quantity,
        color
      });
    }
  }
 const productData = await productModel.find({});

  res.render('cart', { products, productData });
});

router.get('/cart/remove/:color/:id', isAuthenticate, async (req, res) => {
  const color = req.params.color;
  const productId = req.params.id;

  await userModel.findByIdAndUpdate(
    req.user.id,
    {
      $pull: {
        cart: {
          productId: productId,
          color: color
        }
      }
    }
  );

  res.redirect('/product/cart');
});

router.post("/cart/update/:id", isAuthenticate, async (req, res) => {
    const productId = req.params.id;
    const { color, quantity } = req.body;

    const user = await userModel.findById(req.user.id);

    const item = user.cart.find(
        (i) => i.productId == productId && i.color == color
    );

    if (item) {
        item.quantity = quantity;
        await user.save();
        return res.json({ success: true });
      
    }
    res.redirect('/product/cart');
    res.json({ success: false });
});

router.get('/checkout', isAuthenticate, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate({
      path: "cart.productId",
      model: "Product"
    });

   if (!user.address || !user.phoneNumber || !user.ward || !user.tole) {
  return res.render('userDetails');
}


    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.cart.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    // Convert cart to orders with FIXED PRICES
    const newOrders = user.cart.map(item => {
      const product = item.productId;

      const priceNow = product.price;                // current price
      const discountNow = product.discount || 0;     // current discount %
      const discountedPrice = priceNow - (priceNow * (discountNow / 100));

      return {
        productId: product._id,
        color: item.color,
        quantity: item.quantity,
        status: "pending",
        orderDate: new Date(),

        // FIXED VALUES (DO NOT CHANGE LATER)
        priceAtPurchase: priceNow,
        discountAtPurchase: discountNow,
        finalPrice: discountedPrice * item.quantity
      };
    });

    // Save orders permanently
    user.orders.push(...newOrders);

    // Clear cart
    user.cart = [];

    await user.save();

    res.redirect('/product/cart');

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get('/orders', isAuthenticate, async (req, res) => {
  const user = await userModel.findById(req.user.id)
    .populate({
      path: 'orders.productId',
      model: 'Product'
    });

  let grouped = {};

  user.orders.forEach(order => {
    // Even if product is deleted later, we might still want to show order details 
    // if you have a backup strategy, but strictly checking productId ensures we don't crash
    if (!order.productId) return;

    let d = new Date(order.orderDate);

    // FORMAT DATE + TIME
    let dateKey = d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        items: [],
        totalCost: 0
      };
    }
    grouped[dateKey].items.push(order);
    // FIX: Use the frozen 'finalPrice' saved at checkout instead of current price
    // finalPrice already includes the calculation (discountedPrice * quantity)
    grouped[dateKey].totalCost += order.finalPrice;
    
  });
  const productData = await productModel.find({});
   const totalQuantity = new Set(
    user.cart.map(item => item.productId.toString() + "-" + item.color)
  ).size;
  res.render('order', { grouped, productData , totalQuantity});
});

// Route to display the list of orders to be cancelled
router.get('/order/cancel/:time', isAuthenticate, async (req, res) => {
  const time = req.params.time;
  
  try {
    const user = await userModel.findById(req.user.id)
      .populate({
        path: 'orders.productId',
        model: 'Product'
      });
      
    // Filter orders by the exact time string passed in the URL (dateKey used in /orders route)
    const ordersToCancel = user.orders.filter(order => {
        let d = new Date(order.orderDate);
        let dateKey = d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return dateKey === time;
    });

    if (ordersToCancel.length === 0) {
        return res.status(404).send("No orders found for this time.");
    }

    // Only allow cancellation if ALL items are in 'pending' status
    const allPending = ordersToCancel.every(order => order.status === 'pending');
    if (!allPending) {
        return res.status(400).send("Cancellation failed: Some items have already been shipped or delivered.");
    }

    res.render('orderCancel', { 
        orders: ordersToCancel, 
        orderTime: time 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders for cancellation.");
  }
});

// Route to handle the cancellation logic (POST request)
router.post('/order/cancelled/:time', isAuthenticate, async (req, res) => {
    const time = req.params.time;
    const { reason } = req.body;

    try {
        const user = await userModel.findById(req.user.id);
        
        let cancelledCount = 0;
        
        // Use the same date formatting logic to find the orders by group time
        user.orders.forEach(order => {
            let d = new Date(order.orderDate);
            let dateKey = d.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            // If the order group time matches AND the status is pending, cancel it
            if (dateKey === time && order.status === 'pending') {
                order.status = 'cancelled';
                order.cancellationReason = reason; 
                cancelledCount++;
            }
        });

        if (cancelledCount === 0) {
            return res.redirect('/orders'); // Nothing was cancelled, maybe already shipped
        }

        await user.save();
        res.redirect('/orders');

    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing cancellation.");
    }
});

router.post('/user/details', isAuthenticate, async (req, res) => {
  try {
    let { address, phoneNumber, ward, tole } = req.body;

    // Find user
    const user = await userModel.findById(req.user.id);

    // Update user fields
    user.address = address;
    user.phoneNumber = phoneNumber;
    user.ward = ward;
    user.tole = tole;

    // Save changes
    await user.save();

    res.redirect('/checkout');
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});


router.get('/categories/:category', isAuthenticate, async (req, res) => {
  try {
    const category = req.params.category;

    // Find all products that match this category
    const products = await productModel.find({ category: category });

    if (!products.length) {
      return res.render('categories', { products: [], category });
    }
    const user = await userModel.findById(req.user.id);
      const totalQuantity = new Set(
        user.cart.map(item => item.productId.toString() + "-" + item.color)
      ).size;
      const productData = await productModel.find({});
    res.render('categories', { products, category , totalQuantity, productData});

  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.get('/product/:category', isAdmin, async (req, res) => {
  try {
    const category = req.params.category;

    // Find all products that match this category
    const products = await productModel.find({ category: category });

    const productData = await productModel.find();

    if (!products.length) {
      return res.render('categories', { products: [], category });
    }
    res.render('productcategories', { products, category, productData});

  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post('/product/search', isAuthenticate, async (req, res) => {
  try {
    const searchItem = req.body.search.trim();
    const user = await userModel.findById(req.user.id);
    const totalQuantity = new Set(
    user.cart.map(item => item.productId.toString() + "-" + item.color)
  ).size;
    // If empty search
    if (!searchItem) {
      return res.render('search', { products: [], searchItem });
    }

    const products = await productModel.find({
      $or: [
        { productname: { $regex: searchItem, $options: "i" } }, // partial match
        { category: { $regex: searchItem, $options: "i" } },    // partial match
        { tag: { $in: [ new RegExp(searchItem, "i") ] } }       // tag match
      ]
    });

    res.render('search', {
      products,
      searchItem, totalQuantity
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching products");
  }
});

router.post('/product/searchAdmin', isAdmin, async (req, res) => {
  try {
    const searchItem = req.body.search.trim();
    // If empty search
    if (!searchItem) {
      return res.render('search', { products: [], searchItem });
    }
    
    const productData = await productModel.find();

    const products = await productModel.find({
      $or: [
        { productname: { $regex: searchItem, $options: "i" } }, // partial match
        { category: { $regex: searchItem, $options: "i" } },    // partial match
        { tag: { $in: [ new RegExp(searchItem, "i") ] } }       // tag match
      ]
    });

    res.render('searchItemList', {
      products,
      searchItem, productData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching products");
  }
});

router.post('/user/searchAdmin', isAdmin, async (req, res) => {
  try {
    const searchUser = req.body.search.trim();
    // If empty search
    if (!searchUser) {
      return res.render('search', { user: [], searchUser});
    }
    
    const users = await userModel.find({
      $or: [
        { username: { $regex: searchUser, $options: "i" } }, // partial match
        { email: { $regex: searchUser, $options: "i" } },    // partial match
        { address: { $regex: searchUser, $options: "i" }}       // tag match
      ]
    }).populate('orders.productId');

    res.render('productOrder', {users});

  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching products");
  }
});



 
module.exports = router;