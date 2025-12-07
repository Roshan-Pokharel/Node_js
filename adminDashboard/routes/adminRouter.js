const express = require('express');
const router = express.Router();
const {registerAdmin} = require('../controllers/authController');
const isAdmin = require('../middlewares/authMiddleware');

router.get('/admin', (req, res) => { 
    res.render('adminreg');
});

router.post('/register/admin', registerAdmin);


module.exports = router;