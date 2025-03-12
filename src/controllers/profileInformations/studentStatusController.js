const { 
    fetchStudentStatusData,
    checkStudentStatusNameData,
    addStudentStatusData,
    checkIdStudentStatusData,
    updateStudentStatusData,
    removeStudentStatusData
} = require('../../models/profileInformations/studentStatusModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล StudentStatus (ข้อมูลสถานะนักศึกษา)
exports.getAlldataStudentStatus = async (req, res) => {
    try {
        const fetchStudentStatusDataResult = await fetchStudentStatusData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchStudentStatusDataResult) || fetchStudentStatusDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchStudentStatusDataResult);
    } catch (error) {
        console.error("Error fetching student status data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล StudentStatus (ข้อมูลสถานะนักศึกษา)
exports.addDataStudentStatus = async (req, res) => {
    try {
        const { student_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!student_status_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check student_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentStatusNameDataResult = await checkStudentStatusNameData(student_status_name);
        if (checkStudentStatusNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (student_status_name) สถานะนักศึกษา) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addStudentStatusDataResult = await addStudentStatusData(req.body, req.name);
        if (addStudentStatusDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล StudentStatus (ข้อมูลสถานะนักศึกษา)
exports.updateDataStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdStudentStatusDataResult = await checkIdStudentStatusData(id);
        if (!checkIdStudentStatusDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลสถานะนักศึกษา) อยู่ในระบบ!');
        }

        const { student_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!student_status_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check student_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentStatusNameDataResult = await checkStudentStatusNameData(student_status_name);
        if (checkStudentStatusNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (student_status_name) สถานะนักศึกษา) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateStudentStatusDataResult = await updateStudentStatusData(id, req.body, req.name);
        if (updateStudentStatusDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล StudentStatus( ข้อมูลสถานะนักศึกษา )
exports.removeDataStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdStudentStatusDataResult = await checkIdStudentStatusData(id);
        if (!checkIdStudentStatusDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลสถานะนักศึกษา) อยู่ในระบบ!');
        }

        const removeStudentStatusDataResult = await removeStudentStatusData(id, req.body);
        if (removeStudentStatusDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}