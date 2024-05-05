require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

router.post('/register' , async(req,res)=>{
    try {
      const { username, email, password } = req.body;
      let success = false;
      let user = await User.findOne({ email: email })
      if (user) {
          res.status(500).json({ success: success, error: "Your email is already Register Login or Register with other email " });
  
      }
      else if (password.length < 8) {
          res.status(500).json({ success: success, error: "Password Must Contain 8 letters " });
      }
  
      else {
          let salt = await bcrypt.genSaltSync(10);
          let hash = await bcrypt.hashSync(password, salt);
          const newUser = await User.create({
              username: username,
              email: email,
              password: hash
          })
          const data = {
              user: {
                  id: newUser.id,
                  email: newUser.email
              }
          }
          success = true;
          var token = jwt.sign(data, process.env.SECRET_TOKEN);
  
          res.status(201).json({ success: success, token: token })
      }
    } catch (error) {
        console.log(error)
        res.status(500).json({error : error , success : false})
    }
  })
  
  
  router.post('/login' , async(req,res)=>{
    try {
        const {email ,password} = req.body
        let user = await User.findOne({ email: email })
        if (user) {
            const passwordCompare = await bcrypt.compare(password, user.password)
            if(passwordCompare){
                const data = {
                    user  : {
                        id: user.id,
                        email: user.email
                    }
                }
                success = true;
                var token = jwt.sign(data, process.env.SECRET_TOKEN);
                res.json({ success:true, token: token})
            }else{
              res.json({success : false , error : "Invalid Password"})
            }
          }
  
        else{
            res.status(500).json({success : false , error : "Invalid Email or Password "})
        }
    } catch (error) {
        res.status(500).json({error : error , success : false })
    }
  })
  



module.exports = router ; 