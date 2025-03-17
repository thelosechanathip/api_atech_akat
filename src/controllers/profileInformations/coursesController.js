const { 
    fetchCoursesData,
    CheckIdEducationLevel,
    addCoursesData,
    checkIdCoursesData,
    updateCoursesData,
    removeCoursesData
} = require('../../models/profileInformations/coursesModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.getAlldataCourses = async (req, res) => {
    try {
        const fetchCoursesDataResults = await fetchCoursesData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchCoursesDataResults) || fetchCoursesDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchCoursesDataResults);
    } catch (error) {
        console.error("Error getAlldataCourses data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.addDataCourses = async (req, res) => {
    try {
        const { subject_type, career_group, field_of_study, education_level_id } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!subject_type || !field_of_study || !education_level_id) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        const CheckIdEducationLevelResult = await CheckIdEducationLevel(education_level_id);
        if(!CheckIdEducationLevelResult) return msg(res, 404, 'ไม่มี (ระดับการศึกษา) อยู่ในระบบ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addCoursesDataResult = await addCoursesData(req.body, req.name);
        if (addCoursesDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.updateDataCourses = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdCoursesDataResult = await checkIdCoursesData(id);
        if (!checkIdCoursesDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลหมวดหมู่วิชา) อยู่ในระบบ!');

        const { subject_type, career_group, field_of_study, education_level_id } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!subject_type || !field_of_study || !education_level_id) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        const CheckIdEducationLevelResult = await CheckIdEducationLevel(education_level_id);
        if(!CheckIdEducationLevelResult) return msg(res, 404, 'ไม่มี (ระดับการศึกษา) อยู่ในระบบ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateCoursesDataResult = await updateCoursesData(id, req.body, req.name);
        if (updateCoursesDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.removeDataCourses = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdCoursesDataResult = await checkIdCoursesData(id);
        if (!checkIdCoursesDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลหมวดหมู่วิชา) อยู่ในระบบ!');

        const removeCoursesDataResult = await removeCoursesData(id);
        if (removeCoursesDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}