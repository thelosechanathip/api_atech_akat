const express = require('express');
const router = express.Router();
const { authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAllDataStudents, checkUniqueDataStudent, registerDataStudent, updateDataStudent, removeDataStudent } = require('../controllers/members/studentController');
const { getAllDataTeachers, checkUniqueDataTeacher, registerDataTeacher, updateDataTeacher, removeDataTeacher } = require('../controllers/members/teacherController');
const { getAllDataAdmin, checkUniqueDataAdmin, addDataAdmin, updateDataAdmin, removeDataAdmin } = require('../controllers/members/adminController');

// @ENDPOINT = http://localhost:5000/apiv2/student { student }
router.get('/getStudents', authCheckAdmin, getAllDataStudents);
router.get('/checkUniqueStudent', authCheckAdmin, checkUniqueDataStudent);
router.post('/registerStudent', authCheckAdmin, registerDataStudent);
router.put('/updateStudent/:id', authCheckAdmin, updateDataStudent);
router.delete('/removerStudent/:id', authCheckAdmin, removeDataStudent);

// @ENDPOINT = http://localhost:5000/apiv2/teacher { teacher }
router.get('/getTeachers', authCheckAdmin, getAllDataTeachers);
router.get('/checkUniqueTeacher', authCheckAdmin, checkUniqueDataTeacher);
router.post('/registerTeacher', authCheckAdmin, registerDataTeacher);
router.put('/updateTeacher/:id', authCheckAdmin, updateDataTeacher);
router.delete('/removerTeacher/:id', authCheckAdmin, removeDataTeacher);

// @ENDPOINT = http://localhost:5000/apiv2/admin { admin }
router.get('/getAdmin', authCheckAdmin, getAllDataAdmin);
router.get('/checkUniqueAdmin', authCheckAdmin, checkUniqueDataAdmin);
router.post('/addAdmin', authCheckAdmin, addDataAdmin);
router.put('/updateAdmin/:id', authCheckAdmin, updateDataAdmin);
router.delete('/deleteAdmin/:id', authCheckAdmin, removeDataAdmin);

module.exports = router;