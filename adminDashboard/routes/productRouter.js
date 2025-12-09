const express =require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../model/product');
const userModel = require('../model/user');
const isAdmin = require('../middlewares/adminMiddleware');
const { route } = require('./userRouter');
const isAuthenticate = require('../middlewares/authMiddleware');
 const getProduct = require('../utils/getProduct');

router.get('/product' , isAdmin, async (req, res)=>{
  const products = await productModel.find();
  res.render('product', {products});
});

router.get('/product/crud', isAdmin , async(req, res)=>{   
  const products = await productModel.find();
    res.render('productList', {products});
} )

router.get('/product/add', isAdmin, async (req, res)=>{
  
  res.render('productAdd');
})

router.post('/product/added', upload.array('image', 6), async (req, res) => {
  try {
    let colors = req.body.color;
    let colorArray = [];
    if (colors) {
    colorArray = colors.split(',').map(color => color.trim());
    }
    const product = new productModel({
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      discount : req.body.discount,
      offer: req.body.offer,
      colors: colorArray,
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

  try {
    const updateData = {
      productname: req.body.productname,
      description: req.body.description,
      color: req.body.color,
      price: req.body.price,
      rating: req.body.rating,
      discount: req.body.discount,
      offer: req.body.offer
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
    const item = user.orders.find(i => 
      i.productId.toString() === productId && i.color === selectedColor
    );

    if (item) {
      // If product + specific color exists, just update quantity
      item.quantity += quantity;
    } else {
      // 3. If not, push new item WITH the color field
      user.orders.push({
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

router.get('/product/order',isAdmin, (req, res)=>{
    res.render('productOrder');
})

router.get('/product/detail/:id', isAuthenticate, async(req, res)=>{
     try {
     const product = await productModel.findById(req.params.id) .populate({ path: 'reviews.userId', select: 'username email' });
        res.render('productDetail', { product });
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




module.exports = router;