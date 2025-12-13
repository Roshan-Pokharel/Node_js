require('dotenv').config();
const express = require('express'); 
const path = require('path');  
const mongoose = require('./config/mongoose-connection');
const app = express();
const router = require('router');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const productRouter = require('./routes/productRouter');
const isAuthenticated = require('./middlewares/authMiddleware');
const isAdmin = require('./middlewares/adminMiddleware');
const secretkey = process.env.SECRET_KEY;
const session = require('express-session');
const productModel = require('./model/product');
const userModel = require('./model/user');
const jwt = require('jsonwebtoken');


app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', productRouter);


app.get('/dashboard', async (req, res) => {
  const products = await productModel.find();
  let signin = false;
  let totalQuantity = 0;

  if (req.cookies.authToken) {
    try {
      const decoded = jwt.verify(req.cookies.authToken, secretkey);

      const user = await userModel.findById(decoded.id);

      if (user && user.cart) {
        signin= true;
        totalQuantity = new Set(
          user.cart.map(item => item.productId.toString() + "-" + item.color)
        ).size;
      }

    } catch (err) {
      // Invalid token → treat as guest
      totalQuantity = 0;
    }
  }

  res.render('dashboard', { products, totalQuantity, signin  });
});





app.get('/admindashboard',isAdmin, async(req, res) => {
  const products = await productModel.find();
  res.render('admindashboard', {products});
});


app.get('/logout', (req, res)=>{
  res.cookie('authToken', "");
  res.cookie('adminAuthToken', "");
  res.redirect('/login');
})

app.get('/userlogout', (req, res)=>{
  res.cookie('authToken', "");
  res.redirect('/dashboard');
})



app.listen(3000, () => {
    console.log('Admin Dashboard is running on port 3000');
});
