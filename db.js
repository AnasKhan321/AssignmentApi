const mongoose = require('mongoose');

const ConnectToMongo = async()=>{
	  await mongoose.connect('mongodb://127.0.0.1:27017/AssginmentServer');
	  console.log("mongoose connected")
}

module.exports = ConnectToMongo; 

