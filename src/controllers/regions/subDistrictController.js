const {
    fetchSubDistrictData,
    fetchSubDistrictsDataByDistrictId,
    checkSubDistrictCodeData,
    checkSubDistrictNameInThaiData,
    checkSubDistrictNameInEnglishData,
    checkSubDistrictDistrictIdData,
    addSubDistrictData,
    checkIdSubDistrictData,
    updateSubDistrictData,
    removeSubDistrictData
} = require('../../models/regions/subDistrictModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล SubDistrict (ข้อมูลตำบล)
exports.getAlldataSubDistrict = async(req, res) => {
    try {
        const fetchSubDistrictDataResult = await fetchSubDistrictData();
        if (!Array.isArray(fetchSubDistrictDataResult) || fetchSubDistrictDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchSubDistrictDataResult);
    } catch(err) {
        console.log(err);
        return msg(res, 500, err.message);
    }
}

// ใช้สำหรับดึงข้อมูล SubDistrict (ข้อมูลตำบล) ที่อ้างอิงจาก district_id
exports.getSubDistrictsDataByDistrictId = async (req, res) => {
    try {
        const { id } = req.params;

        const fetchSubDistrictsDataByDistrictIdResult = await fetchSubDistrictsDataByDistrictId(id);
        if (!Array.isArray(fetchSubDistrictsDataByDistrictIdResult) || fetchSubDistrictsDataByDistrictIdResult.length === 0) return msg(res, 404, "No data found");

        return msg(res, 200, fetchSubDistrictsDataByDistrictIdResult);
    } catch(err) {
        console.log(err);
        return msg(res, 500, err.message);
    }
}

// ใช้สำหรับเพิ่มข้อมูล SubDistrict (ข้อมูลตำบล)
exports.addDataSubDistrict = async (req, res) => {
    try {
        const { code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english || !latitude || !longitude || !district_id || !zip_code) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictCodeDataResult = await checkSubDistrictCodeData(code);
        if (checkSubDistrictCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictNameInThaiResult = await checkSubDistrictNameInThaiData(name_in_thai);
        if (checkSubDistrictNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictNameInEnglishResult = await checkSubDistrictNameInEnglishData(name_in_english);
        if (checkSubDistrictNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check district_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictDistrictIdResult = await checkSubDistrictDistrictIdData(district_id);
        if (!checkSubDistrictDistrictIdResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) ที่ท่านเลือกกรุณาเพิ่มข้อมูลอำเภอก่อนค่อยมาเพิ่มข้อมูลตำบล!');
        }

        // ตรวจสอบค่าของ Latitude && Longitude
        const latLonRegex = /^-?([1-8]?[0-9](\.\d{1,10})?|90(\.0{1,10})?)$/;
        const lonRegex = /^-?(180(\.0{1,10})?|([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,10})?)$/;

        if (!latLonRegex.test(latitude.toString())) {
            return msg(res, 400, "ค่า Latitude ต้องอยู่ระหว่าง -90 ถึง 90 และเป็นตัวเลขเท่านั้น");
        }

        if (!lonRegex.test(longitude.toString())) {
            return msg(res, 400, "ค่า Longitude ต้องอยู่ระหว่าง -180 ถึง 180 และเป็นตัวเลขเท่านั้น");
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addSubDistrictDataResult = await addSubDistrictData(req.body);
        if (addSubDistrictDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล SubDistrict (ข้อมูลตำบล)
exports.updateDataSubDistrict = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdSubDistrictDataResult = await checkIdSubDistrictData(id);
        if (!checkIdSubDistrictDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลตำบล) อยู่ในระบบ!');
        }

        const { code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english || !latitude || !longitude || !district_id || !zip_code) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictCodeDataResult = await checkSubDistrictCodeData(code);
        if (checkSubDistrictCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictNameInThaiResult = await checkSubDistrictNameInThaiData(name_in_thai);
        if (checkSubDistrictNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictNameInEnglishResult = await checkSubDistrictNameInEnglishData(name_in_english);
        if (checkSubDistrictNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลตำบล) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check district_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSubDistrictDistrictIdResult = await checkSubDistrictDistrictIdData(district_id);
        if (!checkSubDistrictDistrictIdResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) ที่ท่านเลือกกรุณาเพิ่มข้อมูลอำเภอก่อนค่อยมาเพิ่มข้อมูลตำบล!');
        }

        // ตรวจสอบค่าของ Latitude && Longitude
        const latLonRegex = /^-?([1-8]?[0-9](\.\d{1,10})?|90(\.0{1,10})?)$/;
        const lonRegex = /^-?(180(\.0{1,10})?|([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,10})?)$/;

        if (!latLonRegex.test(latitude.toString())) {
            return msg(res, 400, "ค่า Latitude ต้องอยู่ระหว่าง -90 ถึง 90 และเป็นตัวเลขเท่านั้น!");
        }

        if (!lonRegex.test(longitude.toString())) {
            return msg(res, 400, "ค่า Longitude ต้องอยู่ระหว่าง -180 ถึง 180 และเป็นตัวเลขเท่านั้น!");
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateSubDistrictDataResult = await updateSubDistrictData(id, req.body);
        if (updateSubDistrictDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล SubDistrict( ข้อมูลตำบล )
exports.removeDataSubDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdSubDistrictDataResult = await checkIdSubDistrictData(id);
        if (!checkIdSubDistrictDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลตำบล) อยู่ในระบบ!');
        }

        const removeSubDistrictDataResult = await removeSubDistrictData(id, req.body);
        if (removeSubDistrictDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err.message);
    }
}