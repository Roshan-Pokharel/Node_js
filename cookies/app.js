const express = require('express');
const path = require('path');
const userData = require('./models/user');
const post = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const upload = require('./utils/multer');
const user = require('./models/user');

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
  if(!username || !email || !password || !age){
    return res.render('fillall');
  }
  const user = await userData.findOne({ email });
  if (user) {
    return res.send('User already exists');
  }
  bcrypt.genSalt(10,(err, salt) => {
   bcrypt.hash(password, salt, async (err, hash) => {
    let newUserData = await userData.create({
        username,
        email,
        password :hash,
        age
  });
    const token =  jwt.sign({email , userId : newUserData._id}, 'secretkey',{expiresIn : '2h'});
      res.cookie('token', token);
      res.redirect('/dashboard');
 
         });

      });

});

app.get('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('login');
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
    
    const token = jwt.sign({ email , userId : user._id}, 'secretkey', { expiresIn: '2h' });
    res.cookie('token', token);
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});


app.get('/dashboard',isAuthenticated, (req, res) => {
  res.render('dashboard');
});

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');   
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
}

app.get('/profile', isAuthenticated, async (req, res) => {
    let user = await userData.findById(req.user.userId).populate('posts');
   // console.log(user);
    res.render('profile', {user});
});
  
app.post('/uploads', isAuthenticated, async (req, res) => {
    let {content} = req.body;
    //console.log(title, content );
    let newPost = await post.create({
      user: req.user.userId,
      content
    });
    await userData.findByIdAndUpdate(req.user.userId, {
      $push: { posts: newPost._id }
    });
    res.redirect('/profile');
    });

  app.get('/like/:id', isAuthenticated, async (req, res) => {
      let postId = req.params.id;
      let userId = req.user.userId;
      let postItem = await post.findById(postId);
      if (!postItem.likes.includes(userId)) {
        postItem.likes.push(userId);
      }
      else {
        postItem.likes = postItem.likes.filter(id => id.toString() !== userId);
      }
      await postItem.save();
      res.redirect('/posts');
    });

    app.get('/posts', isAuthenticated, async (req, res) => {
      let posts = await post.find().populate('user').sort({ createdAt: -1 });
      res.render('post', { posts });
    });

    app.get('/edit/:id', isAuthenticated, async (req, res) => {
      let postId = req.params.id;
      let postItem = await post.findById(postId);
      let user = await userData.findById(req.user.userId);
      res.render('edit', { post: postItem , user});
    });

    app.post('/edits/:id', isAuthenticated, async (req, res) => {
      let postId = req.params.id;
      let { content } = req.body;
      await post.findByIdAndUpdate(postId, { content });
      res.redirect('/profile');
    });

    app.get('/delete/:id', isAuthenticated, async (req, res) => {
      let postId = req.params.id;
      await post.findByIdAndDelete(postId);
      await userData.findByIdAndUpdate(req.user.userId, {
        $pull: { posts: postId }
      });
      res.redirect('/profile');
    });

    app.get('/profile/upload', isAuthenticated, (req, res) => {
      res.render('profileupload');
    });

     app.post('/profile/upload/image', upload.single('image') , isAuthenticated, async(req, res) => {
     let profilepic = req.file.filename;
      let user = await userData.findOne({email : req.user.email});
      user.profilepic = profilepic;
      await user.save();
      res.redirect('/profile');
      });


app.listen(3000);