const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;

const isAuthenticate = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
};

module.exports = isAuthenticate;