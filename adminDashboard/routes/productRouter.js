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
    const product = new productModel({
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
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
  let quantity = parseInt(req.body.quantity) || 1;
  const user = await userModel.findById(req.user.id);
  const item = user.orders.find(i => i.productId.toString() === productId);

  if (item) {
    item.quantity += quantity;
  } else {
    user.orders.push({
      productId,
      quantity
    });
  }

  await user.save();
  res.redirect('/dashboard');
});

router.get('/product/order',isAdmin, (req, res)=>{
    res.render('productOrder');
})

router.get('/product/detail/:id', isAdmin, async(req, res)=>{
     try {
     
        //const product = await getProduct(req.params.id);
        const product = await productModel.findById(req.params.id);
       
        res.render('productDetail', { product });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching product");
    }
})



module.exports = router;