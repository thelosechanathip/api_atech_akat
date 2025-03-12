const express = require('express');
const router = express.Router();
const { authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAlldataEnrollmentYear, addDataEnrollmentYear, updateDataEnrollmentYear, removeDataEnrollmentYear } = require('../controllers/profileInformations/enrollmentYearController');
const { getAlldataGender, addDataGender, updateDataGender, removeDataGender } = require('../controllers/profileInformations/genderController');
const { getAlldataPosition, addDataPosition, updateDataPosition, removeDataPosition } = require('../controllers/profileInformations/positionController');
const { getAlldataPrefix, addDataPrefix, updateDataPrefix, removeDataPrefix } = require('../controllers/profileInformations/prefixController');
const { getAlldataStudentStatus, addDataStudentStatus, updateDataStudentStatus, removeDataStudentStatus } = require('../controllers/profileInformations/studentStatusController');
const { getAlldataTeacherStatus, addDataTeacherStatus, updateDataTeacherStatus, removeDataTeacherStatus } = require('../controllers/profileInformations/teacherStatusController');
const { getAlldataEducationLevel, addDataEducationLevel, updateDataEducationLevel, removeDataEducationLevel } = require('../controllers/profileInformations/educationLevelController');

// @ENDPOINT = http://localhost:5001/apiv2/enrollmentYear { enrollmentYear }
router.get('/getEnrollmentYear', authCheckAdmin, getAlldataEnrollmentYear);
router.post('/addEnrollmentYear', authCheckAdmin, addDataEnrollmentYear);
router.put('/updateEnrollmentYear/:id', authCheckAdmin, updateDataEnrollmentYear);
router.delete('/removeEnrollmentYear/:id', authCheckAdmin, removeDataEnrollmentYear);

// @ENDPOINT = http://localhost:5001/apiv2/gender { gender }
router.get('/getGender', authCheckAdmin, getAlldataGender);
router.post('/addGender', authCheckAdmin, addDataGender);
router.put('/updateGender/:id', authCheckAdmin, updateDataGender);
router.delete('/deleteGender/:id', authCheckAdmin, removeDataGender);

// @ENDPOINT = http://localhost:5001/apiv2/position { position }
router.get('/getPosition', authCheckAdmin, getAlldataPosition);
router.post('/addPosition', authCheckAdmin, addDataPosition);
router.put('/updatePosition/:id', authCheckAdmin, updateDataPosition);
router.delete('/removePosition/:id', authCheckAdmin, removeDataPosition);

// @ENDPOINT = http://localhost:5001/apiv2/prefix { prefix }
router.get('/getPrefix', authCheckAdmin, getAlldataPrefix);
router.post('/addPrefix', authCheckAdmin, addDataPrefix);
router.put('/updatePrefix/:id', authCheckAdmin, updateDataPrefix);
router.delete('/daletePrefix/:id', authCheckAdmin, removeDataPrefix);

// @ENDPOINT = http://localhost:5001/apiv2/studentStatus { studentStatus }
router.get('/getStudentStatus', authCheckAdmin, getAlldataStudentStatus);
router.post('/addStudentStatus', authCheckAdmin, addDataStudentStatus);
router.put('/updateStudentStatus/:id', authCheckAdmin, updateDataStudentStatus);
router.delete('/removeStudentStatus/:id', authCheckAdmin, removeDataStudentStatus);

// @ENDPOINT = http://localhost:5001/apiv2/teacherStatus { teacherStatus }
router.get('/getTeacherStatus', authCheckAdmin, getAlldataTeacherStatus);
router.post('/addTeacherStatus', authCheckAdmin, addDataTeacherStatus);
router.put('/updateTeacherStatus/:id', authCheckAdmin, updateDataTeacherStatus);
router.delete('/removeTeacherStatus/:id', authCheckAdmin, removeDataTeacherStatus);

// @ENDPOINT = http://localhost:5001/apiv2/educationLevel { educationLevel }
router.get('/getEducationLevel', authCheckAdmin, getAlldataEducationLevel);
router.post('/addEducationLevel', authCheckAdmin, addDataEducationLevel);
router.put('/updateEducationLevel/:id', authCheckAdmin, updateDataEducationLevel);
// router.delete('/removeEducationLevel/:id', authCheckAdmin, removeDataEducationLevel);

module.exports = router;