const express = require('express');
const path = require('path');
const userData = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser ');

const app = express();
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get('/', (req, res) => {
  res.render('index');
});


app.post('/create', async (req, res) => {
  let { username, email, password, age } = req.body;
  bcrypt.genSalt(10,(err, salt) => {
   bcrypt.hash(password, salt, async (err, hash) => {
    let newUserData = await userData.create({
        username,
        email,
        password :hash,
        age
  });
    const token =  jwt.sign({email}, 'secretkey',{expiresIn : '2h'});
      res.cookie('token', token);
      res.redirect('/dashboard');
 
});

});

});

app.get('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.render('login');
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/verify', async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.send('Invalid username or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid username or password');
    }
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '2h' });
    res.cookie('token', token);
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});


app.get('/dashboard', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }   
  res.render('dashboard');
});
  


app.listen(3000);