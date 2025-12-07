const express =require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../model/product');
const isAdmin = require('../middlewares/adminMiddleware');
const { route } = require('./userRouter');

router.get('/product' , isAdmin, async (req, res)=>{
  res.render('product');
})

router.get('/product/add', isAdmin, async (req, res)=>{
  
  res.render('productAdd');
})

router.post('/product/added',isAdmin,  upload.single('image', 5), async (req, res)=>{
  if (!req.file) {
    return res.status(400).send("Only image files are allowed!");
  }
    let { productname, discription, color, price, discount} = req.body;
    const product = await productModel.create({productname, discription, color, price, discount,
    image:{
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    res.redirect('/product');  
})

module.exports = router;