const { 
    fetchEnrollmentTermData,
    checkEnrollmentTermNameData,
    addEnrollmentTermData,
    checkIdEnrollmentTermData,
    updateEnrollmentTermData,
    removeEnrollmentTermData
} = require('../../models/profileInformations/enrollmentTermModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล EnrollmentTerm (ข้อมูลภาคการศึกษา)
exports.getAlldataEnrollmentTerm = async (req, res) => {
    try {
        const fetchEnrollmentTermDataResult = await fetchEnrollmentTermData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchEnrollmentTermDataResult) || fetchEnrollmentTermDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchEnrollmentTermDataResult);
    } catch (error) {
        console.error("Error fetching enrollment term data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล EnrollmentTerm (ข้อมูลภาคการศึกษา)
exports.addDataEnrollmentTerm = async (req, res) => {
    try {
        const { enrollment_term_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!enrollment_term_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check enrollment_term_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEnrollmentTermNameDataResult = await checkEnrollmentTermNameData(enrollment_term_name);
        if (checkEnrollmentTermNameDataResult) {
            return msg(res, 409, 'มี (enrollment_term_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addEnrollmentTermDataResult = await addEnrollmentTermData(req.body, req.name);
        if (addEnrollmentTermDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล EnrollmentTerm (ข้อมูลภาคการศึกษา)
exports.updateDataEnrollmentTerm = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEnrollmentTermDataResult = await checkIdEnrollmentTermData(id);
        if (!checkIdEnrollmentTermDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลภาคการศึกษา) อยู่ในระบบ!');
        }

        const { enrollment_term_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!enrollment_term_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check enrollment_term_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEnrollmentTermNameDataResult = await checkEnrollmentTermNameData(enrollment_term_name);
        if (checkEnrollmentTermNameDataResult) {
            return msg(res, 409, 'มี (enrollment_term_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateEnrollmentTermDataResult = await updateEnrollmentTermData(id, req.body, req.name);
        if (updateEnrollmentTermDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล EnrollmentTerm( ข้อมูลภาคการศึกษา )
exports.removeDataEnrollmentTerm = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEnrollmentTermDataResult = await checkIdEnrollmentTermData(id);
        if (!checkIdEnrollmentTermDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลภาคการศึกษา) อยู่ในระบบ!');
        }

        const removeEnrollmentTermDataResult = await removeEnrollmentTermData(id);
        if (removeEnrollmentTermDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}