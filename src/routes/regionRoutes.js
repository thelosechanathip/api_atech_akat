const express = require('express');
const router = express.Router();
const { authCheckAdmin } = require('../middleware/accountInformations/authMiddleware.js');
const { getAlldataProvince, addDataProvince, updateDataProvince, removeDataProvince } = require('../controllers/regions/provinceController');
const { getAllDataDistrict, getDistrictsDataByProvinceId, addDataDistrict, updateDataDistrict, removeDataDistrict } = require('../controllers/regions/districtController');
const { getAlldataSubDistrict, getSubDistrictsDataByDistrictId, addDataSubDistrict, updateDataSubDistrict, removeDataSubDistrict } = require('../controllers/regions/subDistrictController');

// @ENDPOINT = http://localhost:5000/apiv2/province { province }
router.get('/getProvince', authCheckAdmin, getAlldataProvince);
router.post('/addProvince', authCheckAdmin, addDataProvince);
router.put('/updateProvince/:id', authCheckAdmin, updateDataProvince);
router.delete('/deleteProvince/:id', authCheckAdmin, removeDataProvince);

// @ENDPOINT = http://localhost:5000/apiv2/district { district }
router.get('/getDistrict', authCheckAdmin, getAllDataDistrict);
router.get('/getDistrictByProvinceId/:id', authCheckAdmin, getDistrictsDataByProvinceId);
router.post('/addDistrict', authCheckAdmin, addDataDistrict);
router.put('/updateDistrict/:id', authCheckAdmin, updateDataDistrict);
router.delete('/deleteDistrict/:id', authCheckAdmin, removeDataDistrict);

// @ENDPOINT = http://localhost:5000/apiv2/subDistrict { subDistrict }
router.get('/getSubDistrict', authCheckAdmin, getAlldataSubDistrict);
router.get('/getSubDistrictByDistrictId/:id', authCheckAdmin, getSubDistrictsDataByDistrictId);
router.post('/addSubDistrict', authCheckAdmin, addDataSubDistrict);
router.put('/updateSubDistrict/:id', authCheckAdmin, updateDataSubDistrict);
router.delete('/deleteSubDistrict/:id', authCheckAdmin, removeDataSubDistrict);

module.exports = router;