const express = require('express');
const router = express.Router();
const { authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAllDataStudents, registerDataStudent, removeDataStudent } = require('../controllers/members/studentController');
const { getAllDataTeachers, registerDataTeacher, removeDataTeacher } = require('../controllers/members/teacherController');
const { getAllDataAdmin, addDataAdmin, updateDataAdmin, removeDataAdmin } = require('../controllers/members/adminController');

// @ENDPOINT = http://localhost:5000/apiv2/student { student }
router.get('/getStudents', authCheckAdmin, getAllDataStudents);
router.post('/registerStudent', authCheckAdmin, registerDataStudent);
router.delete('/removerStudent/:id', authCheckAdmin, removeDataStudent);

// @ENDPOINT = http://localhost:5000/apiv2/teacher { teacher }
router.get('/getTeachers', authCheckAdmin, getAllDataTeachers);
router.post('/registerTeacher', authCheckAdmin, registerDataTeacher);
router.delete('/removerTeacher/:id', authCheckAdmin, removeDataTeacher);

// @ENDPOINT = http://localhost:5000/apiv2/admin { admin }
router.get('/getAdmin', authCheckAdmin, getAllDataAdmin);
router.post('/addAdmin', authCheckAdmin, addDataAdmin);
router.put('/updateAdmin/:id', authCheckAdmin, updateDataAdmin);
router.delete('/deleteAdmin/:id', authCheckAdmin, removeDataAdmin);

module.exports = router;