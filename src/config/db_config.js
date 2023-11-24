const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI,{

}).then(() =>{
    console.log("Successfully connected");
})
.catch((err) =>{
    console.log("Not connected successfully", err);
})