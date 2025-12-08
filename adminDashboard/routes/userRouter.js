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

router.post('/cart/add/:id/:quantity', (req, res)=>{
    let productId = req.params.id;
    let quantity = req.params.quantity;
    console.log(productId, quantity);

    
})

module.exports = router;