const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ONLY login and logout are publicly accessible hooks!
router.post('/login', authController.loginAdmin);
router.get('/logout', authController.logoutAdmin);

module.exports = router;
