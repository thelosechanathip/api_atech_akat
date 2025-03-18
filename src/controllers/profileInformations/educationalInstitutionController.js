const { 
    fetchEducationalInstitutionsData,
    checkEducationalInstitutionNameData,
    checkInstitutionIdData,
    addEducationalInstitutionData,
    checkIdEducationalInstitutionData,
    updateEducationalInstitutionData,
    removeEducationalInstitutionData
} = require('../../models/profileInformations/educationalInstitutionModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล EducationalInstitution (ข้อมูลชื่อสถานที่ศึกษา)
exports.getAllDataEducationalInstitutions = async (req, res) => {
    try {
        const fetchEducationalInstitutionDataResults = await fetchEducationalInstitutionsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchEducationalInstitutionDataResults) || fetchEducationalInstitutionDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchEducationalInstitutionDataResults);
    } catch (error) {
        console.error("Error getAlldataEducationalInstitutions data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล EducationalInstitution (ข้อมูลชื่อสถานที่ศึกษา)
exports.addDataEducationalInstitution = async (req, res) => {
    try {
        const { educational_institution_name, institution_id } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!educational_institution_name || !institution_id) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check educational_institution_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationalInstitutionNameDataResult = await checkEducationalInstitutionNameData(educational_institution_name);
        if (checkEducationalInstitutionNameDataResult) return msg(res, 409, 'มี (educational_institution_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        const checkInstitutionIdDataResult = await checkInstitutionIdData(institution_id);
        if(!checkInstitutionIdDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลชนิดของสถานที่ศึกษานี้) อยู่ในระบบ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addEducationalInstitutionDataResult = await addEducationalInstitutionData(req.body, req.name);
        if (addEducationalInstitutionDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล EducationalInstitution (ข้อมูลชื่อสถานที่ศึกษา)
exports.updateDataEducationalInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEducationalInstitutionDataResult = await checkIdEducationalInstitutionData(id);
        if (!checkIdEducationalInstitutionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสาขา) อยู่ในระบบ!');

        const { educational_institution_name, institution_id } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!educational_institution_name || !institution_id) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check educational_institution_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationalInstitutionNameDataResult = await checkEducationalInstitutionNameData(educational_institution_name);
        if (checkEducationalInstitutionNameDataResult) return msg(res, 409, 'มี (educational_institution_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        const checkInstitutionIdDataResult = await checkInstitutionIdData(institution_id);
        if(!checkInstitutionIdDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลชนิดของสถานที่ศึกษานี้) อยู่ในระบบ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateEducationalInstitutionDataResult = await updateEducationalInstitutionData(id, req.body, req.name);
        if (updateEducationalInstitutionDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล EducationalInstitution (ข้อมูลชื่อสถานที่ศึกษา)
exports.removeDataEducationalInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEducationalInstitutionDataResult = await checkIdEducationalInstitutionData(id);
        if (!checkIdEducationalInstitutionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสาขา) อยู่ในระบบ!');

        const removeEducationalInstitutionDataResult = await removeEducationalInstitutionData(id);
        if (removeEducationalInstitutionDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}