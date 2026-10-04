require('dotenv').config();  // Loads hidden keys out of .env into memory

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app=express();

require('./models/users.model');
require('./config/passport');




app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't save uninitialized  empty sessions
    cookie: { 
        secure: false , // Set to true if using HTTPS
      httpOnly: true, // Helps prevent XSS attacks
     maxAge: 1000 * 60 * 60 * 24 // Session expires after 1 day
    } 
}))

app.use(passport.initialize());
app.use(passport.session());

const Port = process.env.PORT

app.get('/' , function(req , res){
    res.send('Welcome to ERP System ');
})

app.listen(Port , function(req , res){
    console.log('Server is running on port : ' , Port);
})