const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');


module.exports.registerUser = async (req, res) => {
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
              await  jwt.sign({email, id:newUser._id}, 'secretkey', {expiresIn:'7d'}, (err, token) => {
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
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }
        if(remember==='1' ){
           await jwt.sign({email, id:user._id}, 'secretkey', {expiresIn:'7d'}, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
                res.redirect('/dashboard'); 
            });   
          }
          else{
       await jwt.sign({ email, id: user._id }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error("Error generating token:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.cookie('authToken', token, { httpOnly: true }); 
            res.redirect('/dashboard'); 
        })}
    } catch (err) {
        console.error("Error during user login:", err);
        res.status(500).send("Internal Server Error");
    }
}