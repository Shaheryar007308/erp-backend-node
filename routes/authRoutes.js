const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// All relative endpoints point directly from our mounted auth base pathway
router.post('/register', authController.registerAdmin);
router.post('/login', authController.loginAdmin);
router.get('/logout', authController.logoutAdmin);

module.exports = router;
