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
const { getAlldataEnrollmentTerm, addDataEnrollmentTerm, updateDataEnrollmentTerm, removeDataEnrollmentTerm } = require('../controllers/profileInformations/enrollmentTermController');
const { getAlldataEthnicities, addDataEthnicity, updateDataEthnicity, removeDataEthnicity } = require('../controllers/profileInformations/ethnicityController');
const { getAlldataInstitutions, addDataInstitution, updateDataInstitution, removeDataInstitution } = require('../controllers/profileInformations/institutionController');
const { getAlldataMaritalStatus, addDataMaritalStatus, updateDataMaritalStatus, removeDataMaritalStatus } = require('../controllers/profileInformations/maritalStatusController');
const { getAlldataNationalities, addDataNationality, updateDataNationality, removeDataNationality } = require('../controllers/profileInformations/nationalityController');
const { getAlldataOccupations, addDataOccupation, updateDataOccupation, removeDataOccupation } = require('../controllers/profileInformations/occupationController');
const { getAlldataRelations, addDataRelation, updateDataRelation, removeDataRelation } = require('../controllers/profileInformations/relationController');
const { getAlldataReligions, addDataReligion, updateDataReligion, removeDataReligion } = require('../controllers/profileInformations/religionController');
const { getAlldataSpecializations, addDataSpecialization, updateDataSpecialization, removeDataSpecialization } = require('../controllers/profileInformations/specializationController');
const { getAlldataCourses, addDataCourses, updateDataCourses, removeDataCourses } = require('../controllers/profileInformations/coursesController');
const { getAllDataEducationalInstitutions, addDataEducationalInstitution, updateDataEducationalInstitution, removeDataEducationalInstitution } = require('../controllers/profileInformations/educationalInstitutionController');

// @ENDPOINT = http://localhost:8000/apiv2/enrollmentYear { enrollmentYear }
router.get('/getEnrollmentYear', authCheckAdmin, getAlldataEnrollmentYear);
router.post('/addEnrollmentYear', authCheckAdmin, addDataEnrollmentYear);
router.put('/updateEnrollmentYear/:id', authCheckAdmin, updateDataEnrollmentYear);
router.delete('/removeEnrollmentYear/:id', authCheckAdmin, removeDataEnrollmentYear);

// @ENDPOINT = http://localhost:8000/apiv2/gender { gender }
router.get('/getGender', authCheckAdmin, getAlldataGender);
router.post('/addGender', authCheckAdmin, addDataGender);
router.put('/updateGender/:id', authCheckAdmin, updateDataGender);
router.delete('/deleteGender/:id', authCheckAdmin, removeDataGender);

// @ENDPOINT = http://localhost:8000/apiv2/position { position }
router.get('/getPosition', authCheckAdmin, getAlldataPosition);
router.post('/addPosition', authCheckAdmin, addDataPosition);
router.put('/updatePosition/:id', authCheckAdmin, updateDataPosition);
router.delete('/removePosition/:id', authCheckAdmin, removeDataPosition);

// @ENDPOINT = http://localhost:8000/apiv2/prefix { prefix }
router.get('/getPrefix', authCheckAdmin, getAlldataPrefix);
router.post('/addPrefix', authCheckAdmin, addDataPrefix);
router.put('/updatePrefix/:id', authCheckAdmin, updateDataPrefix);
router.delete('/daletePrefix/:id', authCheckAdmin, removeDataPrefix);

// @ENDPOINT = http://localhost:8000/apiv2/studentStatus { studentStatus }
router.get('/getStudentStatus', authCheckAdmin, getAlldataStudentStatus);
router.post('/addStudentStatus', authCheckAdmin, addDataStudentStatus);
router.put('/updateStudentStatus/:id', authCheckAdmin, updateDataStudentStatus);
router.delete('/removeStudentStatus/:id', authCheckAdmin, removeDataStudentStatus);

// @ENDPOINT = http://localhost:8000/apiv2/teacherStatus { teacherStatus }
router.get('/getTeacherStatus', authCheckAdmin, getAlldataTeacherStatus);
router.post('/addTeacherStatus', authCheckAdmin, addDataTeacherStatus);
router.put('/updateTeacherStatus/:id', authCheckAdmin, updateDataTeacherStatus);
router.delete('/removeTeacherStatus/:id', authCheckAdmin, removeDataTeacherStatus);

// @ENDPOINT = http://localhost:8000/apiv2/educationLevel { educationLevel }
router.get('/getEducationLevel', authCheckAdmin, getAlldataEducationLevel);
router.post('/addEducationLevel', authCheckAdmin, addDataEducationLevel);
router.put('/updateEducationLevel/:id', authCheckAdmin, updateDataEducationLevel);
router.delete('/removeEducationLevel/:id', authCheckAdmin, removeDataEducationLevel);


// @ENDPOINT = http://localhost:8000/apiv2/enrollmentTerm { enrollmentTerm }
router.get('/getEnrollmentTerm', authCheckAdmin, getAlldataEnrollmentTerm);
router.post('/addEnrollmentTerm', authCheckAdmin, addDataEnrollmentTerm);
router.put('/updateEnrollmentTerm/:id', authCheckAdmin, updateDataEnrollmentTerm);
router.delete('/removeEnrollmentTerm/:id', authCheckAdmin, removeDataEnrollmentTerm);

// @ENDPOINT = http://localhost:8000/apiv2/Ethnicity { Ethnicity }
router.get('/getEthnicities', authCheckAdmin, getAlldataEthnicities);
router.post('/addEthnicity', authCheckAdmin, addDataEthnicity);
router.put('/updateEthnicity/:id', authCheckAdmin, updateDataEthnicity);
router.delete('/removeEthnicity/:id', authCheckAdmin, removeDataEthnicity);

// @ENDPOINT = http://localhost:8000/apiv2/Institution { Institution }
router.get('/getInstitutions', authCheckAdmin, getAlldataInstitutions);
router.post('/addInstitution', authCheckAdmin, addDataInstitution);
router.put('/updateInstitution/:id', authCheckAdmin, updateDataInstitution);
router.delete('/removeInstitution/:id', authCheckAdmin, removeDataInstitution);

// @ENDPOINT = http://localhost:8000/apiv2/MaritalStatus { MaritalStatus }
router.get('/getMaritalStatus', authCheckAdmin, getAlldataMaritalStatus);
router.post('/addMaritalStatus', authCheckAdmin, addDataMaritalStatus);
router.put('/updateMaritalStatus/:id', authCheckAdmin, updateDataMaritalStatus);
router.delete('/removeMaritalStatus/:id', authCheckAdmin, removeDataMaritalStatus);

// @ENDPOINT = http://localhost:8000/apiv2/Nationality { Nationality }
router.get('/getNationalities', authCheckAdmin, getAlldataNationalities);
router.post('/addNationality', authCheckAdmin, addDataNationality);
router.put('/updateNationality/:id', authCheckAdmin, updateDataNationality);
router.delete('/removeNationality/:id', authCheckAdmin, removeDataNationality);

// @ENDPOINT = http://localhost:8000/apiv2/Occupation { Occupation }
router.get('/getOccupations', authCheckAdmin, getAlldataOccupations);
router.post('/addOccupation', authCheckAdmin, addDataOccupation);
router.put('/updateOccupation/:id', authCheckAdmin, updateDataOccupation);
router.delete('/removeOccupation/:id', authCheckAdmin, removeDataOccupation);

// @ENDPOINT = http://localhost:8000/apiv2/Relation { Relation }
router.get('/getRelations', authCheckAdmin, getAlldataRelations);
router.post('/addRelation', authCheckAdmin, addDataRelation);
router.put('/updateRelation/:id', authCheckAdmin, updateDataRelation);
router.delete('/removeRelation/:id', authCheckAdmin, removeDataRelation);

// @ENDPOINT = http://localhost:8000/apiv2/Religion { Religion }
router.get('/getReligions', authCheckAdmin, getAlldataReligions);
router.post('/addReligion', authCheckAdmin, addDataReligion);
router.put('/updateReligion/:id', authCheckAdmin, updateDataReligion);
router.delete('/removeReligion/:id', authCheckAdmin, removeDataReligion);

// @ENDPOINT = http://localhost:8000/apiv2/Specialization { Specialization }
router.get('/getSpecializations', authCheckAdmin, getAlldataSpecializations);
router.post('/addSpecialization', authCheckAdmin, addDataSpecialization);
router.put('/updateSpecialization/:id', authCheckAdmin, updateDataSpecialization);
router.delete('/removeSpecialization/:id', authCheckAdmin, removeDataSpecialization);

// @ENDPOINT = http://localhost:8000/apiv2/Courses { Courses }
router.get('/getCourses', authCheckAdmin, getAlldataCourses);
router.post('/addCourses', authCheckAdmin, addDataCourses);
router.put('/updateCourses/:id', authCheckAdmin, updateDataCourses);
router.delete('/removeCourses/:id', authCheckAdmin, removeDataCourses);

// @ENDPOINT = http://localhost:8000/apiv2/EducationalInstitution { EducationalInstitution }
router.get('/getEducationalInstitutions', authCheckAdmin, getAllDataEducationalInstitutions);
router.post('/addEducationalInstitution', authCheckAdmin, addDataEducationalInstitution);
router.put('/updateEducationalInstitution/:id', authCheckAdmin, updateDataEducationalInstitution);
router.delete('/removeEducationalInstitution/:id', authCheckAdmin, removeDataEducationalInstitution);

module.exports = router;