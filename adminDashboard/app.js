const express = require('express'); 
const path = require('path');  

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let {username , password, email} = req.body;
    console.log(username);
  });

app.post('/login', (req, res) => {
    let {username , password} = req.body;
  });

app.listen(3000, () => {
    console.log('Admin Dashboard is running on port 3000');
}); 