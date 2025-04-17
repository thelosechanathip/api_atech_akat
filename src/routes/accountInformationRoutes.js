const express = require('express');
const router = express.Router();
const { authCheckToken, authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAlldataRole, addDataRole, updateDataRole, removeDataRole } = require('../controllers/accountInformations/roleController');
const { authGetAllDataUsers, authRegister, authLogin, authVerify, authRemoveUser, authLogout } = require('../controllers/accountInformations/authController');

// @ENDPOINT = http://localhost:5001/api/role
router.get('/getRole', authCheckAdmin, getAlldataRole);
router.post('/addRole', authCheckAdmin, addDataRole);
router.put('/updateRole/:id', authCheckAdmin, updateDataRole);
router.delete('/removeRole/:id', authCheckAdmin, removeDataRole);

// @ENDPOINT = http://localhost:5000/apiv2/auth
router.get('/authGetUsers', authCheckAdmin, authGetAllDataUsers);
router.post('/authRegister', authRegister);
router.post('/authLogin', authLogin);
router.post('/authVerify', authVerify);
router.delete('/authRemoveUser/:id', authCheckAdmin, authRemoveUser);
router.post('/authLogout', authLogout);

module.exports = router;