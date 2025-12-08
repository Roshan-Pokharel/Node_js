const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');

router.get('/register', (req, res) => { 
    res.render('register');
});

router.post('/register/user', registerUser);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login/user', loginUser);



module.exports = router;