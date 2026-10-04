require('dotenv').config();  // Loads hidden keys out of .env into memory

const express = require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const Port = process.env.PORT

app.get('/' , function(req , res){
    res.send('Welcome to ERP System ');
})

app.listen(Port , function(req , res){
    console.log('Server is running on port : ' , Port);
})