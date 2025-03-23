const { 
    fetchTeachersData,
    checkNationalIdData,
    checkEmailData,
    insertTeacherData,
    checkIdTeacherData,
    checkIdInLoginData,
    removeTeacherData
} = require('../../models/members/teacherModel');
const moment = require('moment');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Teacher (ข้อมูลอาจารย์)
exports.getAllDataTeachers = async (req, res) => {
    try {
        const fetchTeacherDataResults = await fetchTeachersData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchTeacherDataResults) || fetchTeacherDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchTeacherDataResults);
    } catch (error) {
        console.error("Error getAllDataTeachers data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.registerDataTeacher = async (req, res) => {
    try {
        const {
            prefix_id,
            first_name_thai,
            last_name_thai,
            first_name_english,
            last_name_english,
            nationality_id,
            ethnicity_id,
            religion_id,
            gender_id,
            national_id,
            date_of_birth,
            phone_number,
            email,
            house_number,
            village_group,
            sub_district_id,
            district_id,
            province_id,
            education_level_id,
            specialization_id,
            educational_institution_id,
            position_id,
            image,
            teacher_status_id
        } = req.body;

        const checkNationalIdDataResult = await checkNationalIdData(national_id);
        if(checkNationalIdDataResult) return msg(res, 409, 'เลขบัตรประจำตัวประชาชนซ้ำไม่สามารถ Register teacher ได้!');

        const checkEmailDataResult = await checkEmailData(email);
        if(checkEmailDataResult) return msg(res, 409, 'Email ซ้ำไม่สามารถ Register teacher ได้!');

        const insertTeacherDataResult = await insertTeacherData(req.body, req.name);
        if(insertTeacherDataResult) return msg(res, 200, 'Register teacher successfully!');
    } catch (error) {
        console.error("Error registerTeacherData data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
}

// ใช้สำหรับลบข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.removeDataTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTeacherDataResult = await checkIdTeacherData(id);
        if (!checkIdTeacherDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์) อยู่ในระบบ!');

        const checkIdInLoginDataResult = await checkIdInLoginData(id, req.userId);
        if (checkIdInLoginDataResult) return msg(res, 400, 'ไม่สามารถลบข้อมูลตัวเองได้!');

        const removeTeacherDataResult = await removeTeacherData(id, req.body);
        if (removeTeacherDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}