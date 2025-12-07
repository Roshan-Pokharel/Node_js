const jwt = require('jsonwebtoken');
const adminsecretkey = process.env.ADMIN_SECRET_KEY;

const isAdmin = (req, res, next) => {
    const token = req.cookies.adminAuthToken;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, adminsecretkey, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.redirect('/admin');
        }
        req.adminUser = decoded;
        next();
    });
};

module.exports = isAdmin;