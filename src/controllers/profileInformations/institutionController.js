const { 
    fetchInstitutionsData,
    checkInstitutionNameData,
    addInstitutionData,
    checkIdInstitutionData,
    updateInstitutionData,
    removeInstitutionData
} = require('../../models/profileInformations/institutionModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Institution (ข้อมูลชนิดของสถานที่ศึกษา)
exports.getAlldataInstitutions = async (req, res) => {
    try {
        const fetchInstitutionDataResults = await fetchInstitutionsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchInstitutionDataResults) || fetchInstitutionDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchInstitutionDataResults);
    } catch (error) {
        console.error("Error fetching institutions data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Institution (ข้อมูลชนิดของสถานที่ศึกษา)
exports.addDataInstitution = async (req, res) => {
    try {
        const { institution_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!institution_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check institution_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkInstitutionNameDataResult = await checkInstitutionNameData(institution_name);
        if (checkInstitutionNameDataResult) return msg(res, 409, 'มี (institution_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addInstitutionDataResult = await addInstitutionData(req.body, req.name);
        if (addInstitutionDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Institution (ข้อมูลชนิดของสถานที่ศึกษา)
exports.updateDataInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdInstitutionDataResult = await checkIdInstitutionData(id);
        if (!checkIdInstitutionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลชนิดของสถานที่ศึกษา) อยู่ในระบบ!');

        const { institution_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!institution_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check institution_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkInstitutionNameDataResult = await checkInstitutionNameData(institution_name);
        if (checkInstitutionNameDataResult) return msg(res, 409, 'มี (institution_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateInstitutionDataResult = await updateInstitutionData(id, req.body, req.name);
        if (updateInstitutionDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Institution (ข้อมูลชนิดของสถานที่ศึกษา)
exports.removeDataInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdInstitutionDataResult = await checkIdInstitutionData(id);
        if (!checkIdInstitutionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลชนิดของสถานที่ศึกษา) อยู่ในระบบ!');

        const removeInstitutionDataResult = await removeInstitutionData(id);
        if (removeInstitutionDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}