require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Connect to MongoDB
require('./config/db');

// Load User model
require('./models/users.model');

require('./models/student.model');

// Load Passport configuration
require('./config/passport');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/students', require('./routes/studentRoutes'));


// Home route
app.get('/', (req, res) => {
    res.send('Welcome to ERP System');
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});