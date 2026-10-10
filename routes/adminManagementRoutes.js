const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminManagementController');
const { ensureAuthenticated, authorizeERPAdmin } = require('../middleware/authMiddleware');

// Secure all endpoints below: Must be logged in AND must be the global ERP_ADMIN
router.use(ensureAuthenticated);
router.use(authorizeERPAdmin);

router.post('/create-admin', adminController.createDeptAdmin);
router.get('/list', adminController.getAllDeptAdmins);
router.delete('/delete-admin/:id', adminController.deleteDeptAdmin);

module.exports = router;
