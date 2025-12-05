const express = require('express'); 
const path = require('path');  
const mongoose = require('./config/mongoose-connection');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const isAuthenticated = require('./middlewares/authMiddleware');
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRouter);
app.get('/dashboard',isAuthenticated, (req, res) => {
    res.render('dashboard');
});

app.get('/logout', (req, res)=>{
  res.cookie('authToken', "")
  res.redirect('/login');
} )

app.listen(3000, () => {
    console.log('Admin Dashboard is running on port 3000');
}); 