require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const MiddleWare = require('../MiddleWare/userverification.js')



router.get('/subscribe' , MiddleWare  , async(req,res)=>{
    const filter = { _id : req.user._id};
    const update = { };
    const options = {
    new: true, 
    };
    const date = new Date()
    const stringDate = dateToString(date)
    const validity  = addMonths(date , 6 )
    if(req.user.lastSubscribe == null ){
       update["lastSubscribe"]  = dateToString(date) 
       update["plan"]  = "Standard" 
       update["subscribeValidity"]  = dateToString(addMonths(date , 6 ))
       update["level"]  = 1
       const updatedUser = await User.findOneAndUpdate(filter, update, options).select('-password')
        res.json({success : true , user : updatedUser})
    }else{
        res.json({message : "Please go to Promote for further Query"})
    }
    
})

router.get('/promote'  , MiddleWare , async(req,res)=>{
    const currentDate  = new Date()

    if(req.user.lastSubscribe == null){
        res.status(500).json({success : false , message : "Please Subscribe First"})
    }
    if(stringToDate(req.user.subscribeValidity)  > currentDate){
        res.status(200).json({success : false , message : "Your are already in plan"})
    }else{
        const filter = { _id : req.user._id};
        const update = { };
        const options = {
        new: true, 
        };
        const plans = ["Standard"  , "Gold"  , "Platinum"]

        const expireDate = new Date(req.user.subscribeValidity);
        expireDate.setDate(expireDate.getDate() + 3);
        if(expireDate >= currentDate ){
            const planDetail = req.user.level ==3?"Platinum" : plans[req.user.level]
            const level = req.user.level==3?3 : req.user.level+1
            update["lastSubscribe"]  = dateToString(currentDate) 
            update["plan"]  = planDetail
            update["subscribeValidity"]  = dateToString(addMonths(currentDate , 6 ))
            update["level"]  = level
            const updatedUser = await User.findOneAndUpdate(filter, update, options).select('-password')
            res.status(200).json({message : "promote it "  , user : updatedUser})
            
        }else{
            update["lastSubscribe"]  = dateToString(currentDate) 
            update["plan"]  = "Standard" 
            update["subscribeValidity"]  = dateToString(addMonths(currentDate , 6 ))
            update["level"]  = 1
            const updatedUser = await User.findOneAndUpdate(filter, update, options).select('-password')
             res.json({success : true , user : updatedUser})
            res.status(200).json({message : "back to basic"})
        }
    }
})


function dateToString(date) {
    if (!(date instanceof Date)) {
      return "Invalid Date";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}



function stringToDate(string) {
    const [year, month, day] = string.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return "Invalid Date";
    }
  
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    return date;
  }




  function addMonths(date, months) {
    const newDate = new Date(date);
  
    const currentMonth = newDate.getMonth();
    const newMonth = currentMonth + months;
  
    const yearIncrement = Math.floor(newMonth / 12);
  
    newDate.setMonth(newMonth % 12);
  
    newDate.setFullYear(newDate.getFullYear() + yearIncrement);
  
    return newDate;
  }
  

module.exports = router ; 