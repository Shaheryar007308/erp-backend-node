const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

const { checkDepartmentAccess , ensureAuthenticated  } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
router.use(ensureAuthenticated);
router.use(checkDepartmentAccess);

router.post('/add', upload.single('photo'), checkDepartmentAccess, studentController.createStudent);
router.get('/list', studentController.getAllStudents);
router.get('/:id',  studentController.getStudent);
router.put('/update/:id/:department', checkDepartmentAccess, studentController.updateStudent);
router.delete('/delete/:id/:department', checkDepartmentAccess, studentController.deleteStudent);

module.exports = router;