const { 
    fetchTeacherStatusData,
    checkTeacherStatusNameData,
    addTeacherStatusData,
    checkIdTeacherStatusData,
    updateTeacherStatusData,
    removeTeacherStatusData
} = require('../../models/profileInformations/teacherStatusModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล TeacherStatus (ข้อมูลสถานะอาจารย์)
exports.getAlldataTeacherStatus = async (req, res) => {
    try {
        const fetchTeacherStatusDataResult = await fetchTeacherStatusData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchTeacherStatusDataResult) || fetchTeacherStatusDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchTeacherStatusDataResult);
    } catch (error) {
        console.error("Error fetching enrollment year data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล TeacherStatus (ข้อมูลสถานะอาจารย์)
exports.addDataTeacherStatus = async (req, res) => {
    try {
        const { teacher_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!teacher_status_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check teacher_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherStatusNameDataResult = await checkTeacherStatusNameData(teacher_status_name);
        if (checkTeacherStatusNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (teacher_status_name) สถานะอาจารย์) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addTeacherStatusDataResult = await addTeacherStatusData(req.body, req.name);
        if (addTeacherStatusDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล TeacherStatus (ข้อมูลสถานะอาจารย์)
exports.updateDataTeacherStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTeacherStatusDataResult = await checkIdTeacherStatusData(id);
        if (!checkIdTeacherStatusDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลสถานะอาจารย์) อยู่ในระบบ!');
        }

        const { teacher_status_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!teacher_status_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check teacher_status_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherStatusNameDataResult = await checkTeacherStatusNameData(teacher_status_name);
        if (checkTeacherStatusNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (teacher_status_name) สถานะอาจารย์) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateTeacherStatusDataResult = await updateTeacherStatusData(id, req.body, req.name);
        if (updateTeacherStatusDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล TeacherStatus( ข้อมูลสถานะอาจารย์ )
exports.removeDataTeacherStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTeacherStatusDataResult = await checkIdTeacherStatusData(id);
        if (!checkIdTeacherStatusDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลสถานะอาจารย์) อยู่ในระบบ!');
        }

        const removeTeacherStatusDataResult = await removeTeacherStatusData(id, req.body);
        if (removeTeacherStatusDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}