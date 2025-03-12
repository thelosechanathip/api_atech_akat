const { 
    fetchEnrollmentYearData,
    checkEnrollmentYearNameData,
    addEnrollmentYearData,
    checkIdEnrollmentYearData,
    updateEnrollmentYearData,
    removeEnrollmentYearData
} = require('../../models/profileInformations/enrollmentYearModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล EnrollmentYear (ข้อมูลปีการศึกษา)
exports.getAlldataEnrollmentYear = async (req, res) => {
    try {
        const fetchEnrollmentYearDataResult = await fetchEnrollmentYearData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchEnrollmentYearDataResult) || fetchEnrollmentYearDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchEnrollmentYearDataResult);
    } catch (error) {
        console.error("Error fetching enrollment year data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล EnrollmentYear (ข้อมูลปีการศึกษา)
exports.addDataEnrollmentYear = async (req, res) => {
    try {
        const { enrollment_year_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!enrollment_year_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check enrollment_year_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEnrollmentYearNameDataResult = await checkEnrollmentYearNameData(enrollment_year_name);
        if (checkEnrollmentYearNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (enrollment_year_name) ปีการศึกษา) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addEnrollmentYearDataResult = await addEnrollmentYearData(req.body, req.name);
        if (addEnrollmentYearDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล EnrollmentYear (ข้อมูลปีการศึกษา)
exports.updateDataEnrollmentYear = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEnrollmentYearDataResult = await checkIdEnrollmentYearData(id);
        if (!checkIdEnrollmentYearDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลปีการศึกษา) อยู่ในระบบ!');
        }

        const { enrollment_year_name, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!enrollment_year_name || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check enrollment_year_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEnrollmentYearNameDataResult = await checkEnrollmentYearNameData(enrollment_year_name);
        if (checkEnrollmentYearNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (enrollment_year_name) ปีการศึกษา) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateEnrollmentYearDataResult = await updateEnrollmentYearData(id, req.body, req.name);
        if (updateEnrollmentYearDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล EnrollmentYear( ข้อมูลปีการศึกษา )
exports.removeDataEnrollmentYear = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEnrollmentYearDataResult = await checkIdEnrollmentYearData(id);
        if (!checkIdEnrollmentYearDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลปีการศึกษา) อยู่ในระบบ!');
        }

        const removeEnrollmentYearDataResult = await removeEnrollmentYearData(id);
        if (removeEnrollmentYearDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}