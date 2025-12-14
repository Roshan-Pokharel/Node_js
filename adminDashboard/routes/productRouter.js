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
  let users = await userModel.find();
   let NewOrder = 0;
  users.forEach((user)=>{
    user.orders.forEach((order)=>{
      if(order.status === 'pending'){
        NewOrder = NewOrder + 1;
      }
    })
  })
  res.render('adminDomain', {products, NewOrder});
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

// Step 1: Add to cart (public)
router.post('/cart/add/:id', (req, res) => {
  const productId = req.params.id;

  if (!req.cookies.authToken) {
    req.flash('cartlogin', 'You need to log in before adding to cart.');
    return res.redirect('/dashboard'); // ✅ return stops further execution
  }

  // Redirect to authenticated add route, preserving quantity & color
  const quantity = req.body.quantity || 1;
  const color = req.body.selectedColor || ''; // optional fallback

  return res.redirect(`/cart/added/${productId}?quantity=${quantity}&color=${encodeURIComponent(color)}`);
});

// Step 2: Add to cart (authenticated)
router.get('/cart/added/:id', isAuthenticate, async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.query.quantity) || 1;
  const selectedColor = req.query.color || '';

  try {
    const user = await userModel.findById(req.user.id);

    // Find existing item with same product + color
    const item = user.cart.find(i =>
      i.productId.toString() === productId && i.color === selectedColor
    );

    if (item) {
      item.quantity += quantity; // update quantity
    } else {
      user.cart.push({
        productId,
        quantity,
        color: selectedColor
      });
    }

    await user.save();

    req.flash('cart', 'Added to cart'); // ✅ optional flash
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to cart");
  }
});


router.get('/product/order',isAdmin, async(req, res)=>{
  const users = (await userModel.find().populate('orders.productId')).reverse();
 
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

router.post('/admin/order/update-group/:userId',isAdmin , async (req, res) => {
  const { userId } = req.params;
  const { status, orderTime } = req.body;

  const user = await userModel.findById(userId);

  user.orders.forEach(order => {
    if (new Date(order.orderDate).getTime() === Number(orderTime)) {
      order.status = status;
    }
  });

  await user.save();
  res.redirect('/product/order');
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

    if (!user) return res.status(404).send("User not found");
    if (user.cart.length === 0) return res.status(400).send("Cart is empty");

    // --- FIX START: Consolidate duplicate cart items before ordering ---
    const consolidatedItems = {};
    
    user.cart.forEach(item => {
      // Create a unique key based on Product ID and Color
      // Handle cases where productId might be null (deleted product)
      if (!item.productId) return; 
      
      const key = `${item.productId._id.toString()}-${item.color || ''}`;
      
      if (consolidatedItems[key]) {
        consolidatedItems[key].quantity += item.quantity;
      } else {
        consolidatedItems[key] = {
          productId: item.productId,
          color: item.color || '',
          quantity: item.quantity
        };
      }
    });
    
    // Convert back to array
    const finalCartItems = Object.values(consolidatedItems);
    // --- FIX END ---

    // Convert consolidated cart items to orders
    const newOrders = finalCartItems.map(item => {
      const product = item.productId; // This is the full product object

      const priceNow = product.price;
      const discountNow = product.discount || 0;
      const discountedPrice = priceNow - (priceNow * (discountNow / 100));

      return {
        productId: product._id,
        color: item.color,
        quantity: item.quantity,
        status: "pending",
        orderDate: new Date(),
        priceAtPurchase: priceNow,
        discountAtPurchase: discountNow,
        finalPrice: discountedPrice * item.quantity
      };
    });

    user.orders.push(...newOrders);
    user.cart = []; // Clear cart
    await user.save();

    res.redirect('/orders'); // Redirect to orders page to see result

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

// ... imports
// router.get('/analysis' ... -> REPLACE THAT ENTIRE ROUTE WITH THIS:

router.get('/analysis', isAdmin, async (req, res) => {
  try {
    const range = req.query.range || 'all'; // Get filter from URL (default: all)
    
    // 1. Calculate the cutoff date based on the filter
    let cutoffDate = new Date(0); // Default to beginning of time
    const now = new Date();
    
    if (range === '7') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (range === '30') {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (range === 'year') {
      cutoffDate.setFullYear(now.getFullYear(), 0, 1); // Start of this year
    }

    const users = await userModel.find({}).populate('orders.productId');

    // --- DATA CONTAINERS ---
    let salesByDate = {};       
    let productSales = {};      
    let salesByDay = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let cancelReasons = {};     
    let customerType = { new: 0, returning: 0 };

    users.forEach(user => {
      // Filter user's orders by date first
      const relevantOrders = user.orders.filter(o => new Date(o.orderDate) >= cutoffDate);
      
      // Skip user entirely if they have no relevant orders in this period
      if (relevantOrders.length === 0) return;

      // Loyalty Check (based on total history or just this period? Usually total history is better for 'Loyalty')
      // But here we check behavior within the selected timeframe
      const validOrders = relevantOrders.filter(o => o.status !== 'cancelled');
      if (validOrders.length === 1) customerType.new++;
      if (validOrders.length > 1) customerType.returning++;

      relevantOrders.forEach(order => {
        if (order.status === 'cancelled') {
          // Normalize text: "Changed mind" and "changed mind" should be same
          const reason = (order.cancellationReason || 'Unknown').trim().toLowerCase();
          // Capitalize first letter for display
          const displayReason = reason.charAt(0).toUpperCase() + reason.slice(1);
          cancelReasons[displayReason] = (cancelReasons[displayReason] || 0) + 1;
        } 
        else {
           // 1. Sales Trend
           const dateKey = order.orderDate.toISOString().split('T')[0];
           salesByDate[dateKey] = (salesByDate[dateKey] || 0) + order.finalPrice;

           // 2. Best Selling Product
           if (order.productId) {
             const pName = order.productId.productname;
             productSales[pName] = (productSales[pName] || 0) + order.quantity;
           }

           // 3. Best Day
           const dayIndex = new Date(order.orderDate).getDay();
           salesByDay[dayIndex] += order.finalPrice;
        }
      });
    });

    // --- SMART GROUPING FOR CANCELLATIONS ---
    // Problem: If 50 people type different reasons, chart breaks.
    // Solution: Keep top 4 reasons, group rest as "Others".
    let sortedReasons = Object.entries(cancelReasons).sort((a, b) => b[1] - a[1]);
    let finalCancelLabels = [];
    let finalCancelData = [];

    if (sortedReasons.length > 5) {
      // Take top 4
      const top4 = sortedReasons.slice(0, 4);
      // Sum the rest
      const othersCount = sortedReasons.slice(4).reduce((sum, item) => sum + item[1], 0);
      
      top4.forEach(item => {
        finalCancelLabels.push(item[0]);
        finalCancelData.push(item[1]);
      });
      // Push "Others"
      finalCancelLabels.push("Others (Misc)");
      finalCancelData.push(othersCount);
    } else {
      // If small number of reasons, just show them all
      finalCancelLabels = sortedReasons.map(x => x[0]);
      finalCancelData = sortedReasons.map(x => x[1]);
    }

    // --- OTHER FORMATTING ---
    const sortedDates = Object.keys(salesByDate).sort();
    const trendLabels = sortedDates; 
    const trendData = sortedDates.map(d => salesByDate[d]);

    const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const productLabels = sortedProducts.map(i => i[0]);
    const productData = sortedProducts.map(i => i[1]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayData = Object.values(salesByDay);

    res.render('analytics', {
      trendLabels, trendData,
      productLabels, productData,
      cancelLabels: finalCancelLabels, 
      cancelData: finalCancelData,
      days, dayData,
      customerType,
      currentRange: range // Pass this to UI to highlight active button
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating analysis");
  }
});



 
module.exports = router;