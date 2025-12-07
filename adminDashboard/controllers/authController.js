const userModel = require('../model/user');
const adminModel= require('../model/admin');
const productModel= require('../model/product');
const bcrypt = require('bcrypt');
const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const secretkey = process.env.SECRET_KEY;
const adminsecretkey = process.env.ADMIN_SECRET_KEY;

// admin registration section start from here 
module.exports.registerAdmin = async (req, res) => {
    const { username, password, email } = req.body;
    const AdminLength = await adminModel.countDocuments();

    if(AdminLength>0){
        return res.redirect('/login');
    }
    else {
     // using bycript to hash password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Store hash in your password DB and other details in mongodb
             try {
             const newAdmin = await adminModel.create({ username, password:hash, email });
              const token = await  jwt.sign({email, id:newAdmin._id}, adminsecretkey , {expiresIn:'7d'});
                res.cookie('adminAuthToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
                res.redirect('/admindashboard');  
                }
                catch(err){
                    console.error(err);
                }
             })
        })  
            
    }
   
}

module.exports.registerUser = async (req, res) => {
     const products = await productModel.find();
    const { username, password, email, remember } = req.body;
    let usernameFound =await  userModel.findOne({email : email});
    if (usernameFound) {
    return res.status(409).send("Username already exists.");
    }
    
    // using bycript to hash password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Store hash in your password DB and other details in mongodb
             try {
             const newUser = await userModel.create({ username, password:hash, email });
             
              if(remember==='1' ){
              await  jwt.sign({email, id:newUser._id}, secretkey , {expiresIn:'7d'}, (err, token) => {
                    if (err) {
                        console.error("Error generating token:", err);
                        return res.status(500).send("Internal Server Error");
                    }
                    res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
                   res.redirect('/dashboard');
                });   
              }
              else{
                 res.redirect('/login'); 
              }
            
    }
    catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).send("Internal Server Error");
    }}); 
    });
   
}

module.exports.loginUser =  async (req, res) => {
    const { email, password , remember} = req.body;
    try {
        const admin = await adminModel.findOne({email});
        if (!admin) {
        const user = await userModel.findOne({ email });
       try{
            if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }
        if(remember==='1' ){
           await jwt.sign({email, id:user._id}, secretkey, {expiresIn:'7d'}, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
                res.redirect('/dashboard'); 
            });   
          }
          else{
       await jwt.sign({ email, id: user._id }, secretkey, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error("Error generating token:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.cookie('authToken', token, { httpOnly: true }); 
            res.redirect('/dashboard'); 
        })}
          } catch(err){
            console.error(err);
          }
        }
        else{
            try{
                 const isMatchAdmin = await bcrypt.compare(password, admin.password);
             if (!isMatchAdmin) {
            return res.status(400).send("Invalid email or password");
             }
              await jwt.sign({email, id:admin._id}, adminsecretkey, {expiresIn:'7d'}, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.cookie('adminAuthToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
                res.redirect('/admindashboard'); 
            }); 
            } catch(err){
                console.error(err);
            }  
        }

    } catch (err) {
        console.error("Error during user login:", err);
        res.status(500).send("Internal Server Error");
    }
}