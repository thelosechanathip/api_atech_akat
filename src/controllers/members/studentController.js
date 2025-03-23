const { 
    fetchStudentsData,
    checkNationalIdData,
    checkEmailData,
    checkStudentCodeData,
    insertStudentData,
    checkIdStudentData,
    checkIdInLoginData,
    removeStudentData
} = require('../../models/members/studentModel');
const moment = require('moment');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Student (ข้อมูลนักศึกษา)
exports.getAllDataStudents = async (req, res) => {
    try {
        const fetchStudentDataResults = await fetchStudentsData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchStudentDataResults) || fetchStudentDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchStudentDataResults);
    } catch (error) {
        console.error("Error getAllDataStudents data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล Student( ข้อมูลนักศึกษา )
exports.registerDataStudent = async (req, res) => {
    try {
        const { ...studentData } = req.body; // ใช้ Spread Operator เพื่อดึงข้อมูลทั้งหมด

        for (const [key, value] of Object.entries(studentData)) {
            if (key === "national_id") {
                const checkNationalIdDataResult = await checkNationalIdData(value);
                if(checkNationalIdDataResult) return msg(res, 409, 'เลขบัตรประจำตัวประชาชนซ้ำไม่สามารถ Register student ได้!');
            }

            if(key === "email") {
                const checkEmailDataResult = await checkEmailData(value);
                if(checkEmailDataResult) return msg(res, 409, 'Email ซ้ำไม่สามารถ Register student ได้!');           
            }

            if(key === "student_code") {
                const checkStudentCodeDataResult = await checkStudentCodeData(value);
                if(checkStudentCodeDataResult) return msg(res, 409, 'รหัสนักศึกษาซ้ำไม่สามารถ Register student ได้!');
            }
        }        

        // const insertStudentDataResult = await insertStudentData(req.body, req.name);
        // if(insertStudentDataResult) return msg(res, 200, 'Register student successfully!');
    } catch (error) {
        console.error("Error registerStudentData data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
}

// ใช้สำหรับลบข้อมูล Student( ข้อมูลนักศึกษา )
exports.removeDataStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdStudentDataResult = await checkIdStudentData(id);
        if (!checkIdStudentDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลนักศึกษา) อยู่ในระบบ!');

        const checkIdInLoginDataResult = await checkIdInLoginData(id, req.userId);
        if (checkIdInLoginDataResult) return msg(res, 400, 'ไม่สามารถลบข้อมูลตัวเองได้!');

        const removeStudentDataResult = await removeStudentData(id, req.body);
        if (removeStudentDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}