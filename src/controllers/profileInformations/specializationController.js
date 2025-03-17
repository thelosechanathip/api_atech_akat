const { 
    fetchSpecializationsData,
    checkSpecializationNameData,
    addSpecializationData,
    checkIdSpecializationData,
    updateSpecializationData,
    removeSpecializationData
} = require('../../models/profileInformations/specializationModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Specialization (ข้อมูลสาขา)
exports.getAlldataSpecializations = async (req, res) => {
    try {
        const fetchSpecializationDataResults = await fetchSpecializationsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchSpecializationDataResults) || fetchSpecializationDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchSpecializationDataResults);
    } catch (error) {
        console.error("Error getAlldataSpecializations data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Specialization (ข้อมูลสาขา)
exports.addDataSpecialization = async (req, res) => {
    try {
        const { specialization_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!specialization_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check specialization_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSpecializationNameDataResult = await checkSpecializationNameData(specialization_name);
        if (checkSpecializationNameDataResult) return msg(res, 409, 'มี (specialization_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addSpecializationDataResult = await addSpecializationData(req.body, req.name);
        if (addSpecializationDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Specialization (ข้อมูลสาขา)
exports.updateDataSpecialization = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdSpecializationDataResult = await checkIdSpecializationData(id);
        if (!checkIdSpecializationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสาขา) อยู่ในระบบ!');

        const { specialization_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!specialization_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check specialization_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkSpecializationNameDataResult = await checkSpecializationNameData(specialization_name);
        if (checkSpecializationNameDataResult) return msg(res, 409, 'มี (specialization_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateSpecializationDataResult = await updateSpecializationData(id, req.body, req.name);
        if (updateSpecializationDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Specialization (ข้อมูลสาขา)
exports.removeDataSpecialization = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdSpecializationDataResult = await checkIdSpecializationData(id);
        if (!checkIdSpecializationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสาขา) อยู่ในระบบ!');

        const removeSpecializationDataResult = await removeSpecializationData(id);
        if (removeSpecializationDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}