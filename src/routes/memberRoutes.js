const express = require('express');
const router = express.Router();
const { authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAllDataStudents, registerDataStudent } = require('../controllers/members/studentController');
const { getAllDataTeacher } = require('../controllers/members/teacherController');
const { getAllDataAdmin, addDataAdmin, updateDataAdmin, removeDataAdmin } = require('../controllers/members/adminController');

// @ENDPOINT = http://localhost:5000/apiv2/student { student }
router.get('/getStudents', authCheckAdmin, getAllDataStudents);
router.post('/registerStudent', authCheckAdmin, registerDataStudent);

// @ENDPOINT = http://localhost:5000/apiv2/teacher { teacher }
router.get('/getTeacher', authCheckAdmin, getAllDataTeacher);

// @ENDPOINT = http://localhost:5000/apiv2/admin { admin }
router.get('/getAdmin', authCheckAdmin, getAllDataAdmin);
router.post('/addAdmin', authCheckAdmin, addDataAdmin);
router.put('/updateAdmin/:id', authCheckAdmin, updateDataAdmin);
router.delete('/deleteAdmin/:id', authCheckAdmin, removeDataAdmin);

module.exports = router;