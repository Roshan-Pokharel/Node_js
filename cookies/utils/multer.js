const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname ,'../public/images/'));
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, name) => {
      const fn = name.toString('hex') + path.extname(file.originalname);
      cb(null, fn);
    });
  }
})

const upload = multer({ storage: storage })
 module.exports = upload;