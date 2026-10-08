const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

const { checkDepartmentAccess , ensureAuthenticated  } = require('../middleware/authMiddleware');

router.use(ensureAuthenticated);

router.post('/add',  checkDepartmentAccess , studentController.addStudent);
router.get('/list', studentController.getAllStudents);
router.get('/:id',  studentController.getStudent);
router.put('/update/:id/:department', checkDepartmentAccess, studentController.updateStudent);
router.delete('/delete/:id/:department', checkDepartmentAccess, studentController.deleteStudent);