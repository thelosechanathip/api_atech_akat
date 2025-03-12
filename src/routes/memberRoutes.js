const express = require('express');
const router = express.Router();
// const authCheckToken = require('../middleware/authCheckToken');
const { getAllDataStudent, addDataStudent, updateDataStudent, removeDataStudent } = require('../controllers/members/studentController');
const { getAllDataTeacher, addDataTeacher, updateDataTeacher, removeDataTeacher } = require('../controllers/members/teacherController');
const { getAllDataAdmin, addDataAdmin, updateDataAdmin, removeDataAdmin } = require('../controllers/members/adminController');

// @ENDPOINT = http://localhost:5000/apiv2/student { student }
router.get('/student', getAllDataStudent);
router.post('/student', addDataStudent);
router.put('/student/:id', updateDataStudent);
router.delete('/student/:id', removeDataStudent);

// @ENDPOINT = http://localhost:5000/apiv2/teacher { teacher }
router.get('/teacher', getAllDataTeacher);
router.post('/teacher', addDataTeacher);
router.put('/teacher/:id', updateDataTeacher);
router.delete('/teacher/:id', removeDataTeacher);

// @ENDPOINT = http://localhost:5000/apiv2/admin { admin }
router.get('/getAdmin', getAllDataAdmin);
router.post('/addAdmin', addDataAdmin);
router.put('/updateAdmin/:id', updateDataAdmin);
router.delete('/deleteAdmin/:id', removeDataAdmin);

module.exports = router;