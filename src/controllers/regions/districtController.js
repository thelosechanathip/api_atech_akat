const {
    fetchDistrictData,
    fetchDistrictsDataByProvinceId,
    checkDistrictCodeData,
    checkDistrictNameInThaiData,
    checkDistrictNameInEnglishData,
    checkDistrictProvinceIdData,
    addDistrictData,
    checkIdDistrictData,
    updateDistrictData,
    checkFkSubDistrictData,
    removeDistrictData
} = require('../../models/regions/districtModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล District (ข้อมูลอำเภอ)
exports.getAllDataDistrict = async(req, res) => {
    try {
        const fetchDistrictDataResult = await fetchDistrictData();
        if (!Array.isArray(fetchDistrictDataResult) || fetchDistrictDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchDistrictDataResult);
    } catch(err) {
        console.log(err);
        return msg(res, 500, err.message);
    }
}

// ใช้สำหรับดึงข้อมูล District (ข้อมูลอำเภอ) ที่อ้างอิงจาก province_id
exports.getDistrictsDataByProvinceId = async (req, res) => {
    try {
        const { province_id } = req.body;
        if(!province_id) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');
        const fetchDistrictsDataByProvinceIdResult = await fetchDistrictsDataByProvinceId(province_id);
        if (!Array.isArray(fetchDistrictsDataByProvinceIdResult) || fetchDistrictsDataByProvinceIdResult.length === 0) return msg(res, 404, "No data found");

        return msg(res, 200, fetchDistrictsDataByProvinceIdResult);
    } catch(err) {
        console.log(err);
        return msg(res, 500, err.message);
    }
}

// ใช้สำหรับเพิ่มข้อมูล District (ข้อมูลอำเภอ)
exports.addDataDistrict = async (req, res) => {
    try {
        const { code, name_in_thai, name_in_english, province_id } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english || !province_id) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictCodeDataResult = await checkDistrictCodeData(code);
        if (checkDistrictCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictNameInThaiResult = await checkDistrictNameInThaiData(name_in_thai);
        if (checkDistrictNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictNameInEnglishResult = await checkDistrictNameInEnglishData(name_in_english);
        if (checkDistrictNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check province_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictProvinceIdResult = await checkDistrictProvinceIdData(province_id);
        if (!checkDistrictProvinceIdResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) ที่ท่านเลือกกรุณาเพิ่มข้อมูลจังหวัดก่อนค่อยมาเพิ่มข้อมูลอำเภอ!');
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addDistrictDataResult = await addDistrictData(req.body);
        if (addDistrictDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล District (ข้อมูลอำเภอ)
exports.updateDataDistrict = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdDistrictDataResult = await checkIdDistrictData(id);
        if (!checkIdDistrictDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลอำเภอ) อยู่ในระบบ!');
        }

        const { code, name_in_thai, name_in_english, province_id } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english || !province_id) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictCodeDataResult = await checkDistrictCodeData(code);
        if (checkDistrictCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictNameInThaiResult = await checkDistrictNameInThaiData(name_in_thai);
        if (checkDistrictNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictNameInEnglishResult = await checkDistrictNameInEnglishData(name_in_english);
        if (checkDistrictNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลอำเภอ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check province_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkDistrictProvinceIdResult = await checkDistrictProvinceIdData(province_id);
        if (!checkDistrictProvinceIdResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) ที่ท่านเลือกกรุณาเพิ่มข้อมูลจังหวัดก่อนค่อยมาเพิ่มข้อมูลอำเภอ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateDistrictDataResult = await updateDistrictData(id, req.body);
        if (updateDistrictDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล District( ข้อมูลอำเภอ )
exports.removeDataDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdDistrictDataResult = await checkIdDistrictData(id);
        if (!checkIdDistrictDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลอำเภอ) อยู่ในระบบ!');

        const checkFkSubDistrictDataResult = await checkFkSubDistrictData(id);
        if(checkFkSubDistrictDataResult) return msg(res, 400, 'กรุณาลบข้อมูลที่เกี่ยวข้องในข้อมูลตำบลก่อนลบข้อมูลอำเภอ!');

        const removeDistrictDataResult = await removeDistrictData(id, req.body);
        if (removeDistrictDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}