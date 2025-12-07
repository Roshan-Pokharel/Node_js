const express =require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../model/product');
const isAdmin = require('../middlewares/adminMiddleware');
const { route } = require('./userRouter');

router.get('/product' , isAdmin, async (req, res)=>{
  res.render('product');
});

router.get('/product/crud', isAdmin , async(req, res)=>{   
  const products = await productModel.find();
    res.render('productList', {products});
} )

router.get('/product/add', isAdmin, async (req, res)=>{
  
  res.render('productAdd');
})

router.post('/product/added',isAdmin,  upload.single('image', 5), async (req, res)=>{
  if (!req.file) {
    return res.status(400).send("Only image files are allowed!");
  }
    let { productname, description, color, price, discount} = req.body;
    const product = await productModel.create({productname, description, color, price, discount,
    image:{
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    res.redirect('/product');  
})

router.post('/product/delete/:id', isAdmin ,async(req, res)=>{
  await productModel.findOneAndDelete(req.params.id);
  res.redirect('/product/crud');
} );


router.get('/product/edit/:id', isAdmin ,async(req, res)=>{
  const productId = req.params.id;
  const product = await productModel.findById(productId);
   res.render('productEdit', {product});
  
} )

router.post('/product/edited/:id', isAdmin ,upload.single('image'),async(req, res)=>{
  let productId = req.params.id;

  try{
    const updateData = {
      productname: req.body.productname,
      description: req.body.description,
      color: req.body.color,
      price: req.body.price,
      rating: req.body.rating,
      discount: req.body.discount,
      offer: req.body.offer 
    };
     if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    await productModel.findByIdAndUpdate(productId, updateData, { new: true });
  }
  catch(err){
    console.error(err);
  }
 

  res.redirect('/product/crud'); 
  
  
} )



module.exports = router;