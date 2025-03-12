const { 
    fetchEducationLevelData,
    checkEducationLevelAbbreviationData,
    checkEducationLevelFullNameData,
    addEducationLevelData,
    checkIdEducationLevelData,
    updateEducationLevelData,
    removeEducationLevelData
} = require('../../models/profileInformations/educationLevelModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล EducationLevel (ข้อมูลระดับการศึกษา)
exports.getAlldataEducationLevel = async (req, res) => {
    try {
        const fetchEducationLevelDataResult = await fetchEducationLevelData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchEducationLevelDataResult) || fetchEducationLevelDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, 'getAlldataEducationLevel');
    } catch (error) {
        console.error("Error fetching education level data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล EducationLevel (ข้อมูลระดับการศึกษา)
exports.addDataEducationLevel = async (req, res) => {
    try {
        const { education_level_abbreviation, education_level_full_name } = req.body;
        
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!education_level_abbreviation || !education_level_full_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');
        
        // Check education_level_abbreviation ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationLevelAbbreviationDataResult = await checkEducationLevelAbbreviationData(education_level_abbreviation);
        if (checkEducationLevelAbbreviationDataResult) return msg(res, 409, 'มี (education_level_abbreviation) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check education_level_full_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationLevelFullNameDataResult = await checkEducationLevelFullNameData(education_level_full_name);
        if (checkEducationLevelFullNameDataResult) return msg(res, 409, 'มี (education_level_full_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addEducationLevelDataResult = await addEducationLevelData(req.body, req.name);
        if (addEducationLevelDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล EducationLevel (ข้อมูลระดับการศึกษา)
exports.updateDataEducationLevel = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEducationLevelDataResult = await checkIdEducationLevelData(id);
        if (!checkIdEducationLevelDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลระดับการศึกษา) อยู่ในระบบ!');
        }

        const { education_level_abbreviation, education_level_full_name } = req.body;
        
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!education_level_abbreviation || !education_level_full_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');
        
        // Check education_level_abbreviation ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationLevelAbbreviationDataResult = await checkEducationLevelAbbreviationData(education_level_abbreviation);
        if (checkEducationLevelAbbreviationDataResult) return msg(res, 409, 'มี (education_level_abbreviation) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check education_level_full_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEducationLevelFullNameDataResult = await checkEducationLevelFullNameData(education_level_full_name);
        if (checkEducationLevelFullNameDataResult) return msg(res, 409, 'มี (education_level_full_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateEducationLevelDataResult = await updateEducationLevelData(id, req.body, req.name);
        if (updateEducationLevelDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};
