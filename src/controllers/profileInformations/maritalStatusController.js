const { 
    fetchMaritalStatusData,
    checkMaritalStatusNameData,
    addMaritalStatusData,
    checkIdMaritalStatusData,
    updateMaritalStatusData,
    removeMaritalStatusData
} = require('../../models/profileInformations/maritalStatusModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล MaritalStatus (ข้อมูลสถานภาพสมรส)
exports.getAlldataMaritalStatus = async (req, res) => {
    try {
        const fetchMaritalStatusDataResults = await fetchMaritalStatusData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchMaritalStatusDataResults) || fetchMaritalStatusDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchMaritalStatusDataResults);
    } catch (error) {
        console.error("Error fetching MaritalStatus data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล MaritalStatus (ข้อมูลสถานภาพสมรส)
exports.addDataMaritalStatus = async (req, res) => {
    try {
        const { marital_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!marital_status_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check marital_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkMaritalStatusNameDataResult = await checkMaritalStatusNameData(marital_status_name);
        if (checkMaritalStatusNameDataResult) return msg(res, 409, 'มี (marital_status_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addMaritalStatusDataResult = await addMaritalStatusData(req.body, req.name);
        if (addMaritalStatusDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล MaritalStatus (ข้อมูลสถานภาพสมรส)
exports.updateDataMaritalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdMaritalStatusDataResult = await checkIdMaritalStatusData(id);
        if (!checkIdMaritalStatusDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสถานภาพสมรส) อยู่ในระบบ!');

        const { marital_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!marital_status_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check marital_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkMaritalStatusNameDataResult = await checkMaritalStatusNameData(marital_status_name);
        if (checkMaritalStatusNameDataResult) return msg(res, 409, 'มี (marital_status_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateMaritalStatusDataResult = await updateMaritalStatusData(id, req.body, req.name);
        if (updateMaritalStatusDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล MaritalStatus (ข้อมูลสถานภาพสมรส)
exports.removeDataMaritalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdMaritalStatusDataResult = await checkIdMaritalStatusData(id);
        if (!checkIdMaritalStatusDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสถานภาพสมรส) อยู่ในระบบ!');

        const removeMaritalStatusDataResult = await removeMaritalStatusData(id);
        if (removeMaritalStatusDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}