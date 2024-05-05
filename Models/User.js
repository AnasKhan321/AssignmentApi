const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const UserScheme = mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true, 
  },
  username: {
    type: String,
    required: true,
  },
  points : {
    type : Number , 
    default : null 
  },
  lastSubscribe : {
    type : String , 
    default : null
  },
  subscribeValidity : {
    type : String , 
    default : null 
  },
  level : {
    type : Number , 
    default : 0 
  },
  plan : {
    type : String , 
    default : null 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default : null
  },
  profileImg : {
    type: String , 
    default : null
  },
  date: {
    type: Date,
    default: Date.now,
  },
 
  
});
const User = mongoose.model("user", UserScheme);

module.exports = User; 