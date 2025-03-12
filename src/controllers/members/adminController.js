const { 
    fetchAdminData,
    checkAdminPrefixIdData,
    checkAdminNationalIdData,
    addAdminData,
    checkIdAdminData,
    updateAdminData,
    removeAdminData
} = require('../../models/members/adminModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.getAllDataAdmin = async (req, res) => {
    try {
        const fetchAdminDataResult = await fetchAdminData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchAdminDataResult) || fetchAdminDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchAdminDataResult);
    } catch (error) {
        console.error("Error fetching admin data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.addDataAdmin = async (req, res) => {
    try {
        const { prefix_id, first_name_thai, last_name_thai, national_id, image, created_by, updated_by } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!prefix_id || !first_name_thai || !last_name_thai || !national_id || !image || !created_by || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkAdminPrefixIdDataResult = await checkAdminPrefixIdData(prefix_id);
        if (!checkAdminPrefixIdDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');
        }

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkAdminNationalIdDataResult = await checkAdminNationalIdData(national_id);
        if (checkAdminNationalIdDataResult) {
            return msg(res, 400, 'มี (ข้อมูล (national_id) ข้อมูลผู้ดูแลระบบ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addAdminDataResult = await addAdminData(req.body);
        if (addAdminDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.updateDataAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdAdminDataResult = await checkIdAdminData(id);
        if (!checkIdAdminDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลปีการศึกษา) อยู่ในระบบ!');
        }

        const { prefix_id, first_name_thai, last_name_thai, national_id, image, updated_by } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!prefix_id || !first_name_thai || !last_name_thai || !national_id || !image || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkAdminPrefixIdDataResult = await checkAdminPrefixIdData(prefix_id);
        if (!checkAdminPrefixIdDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');
        }

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkAdminNationalIdDataResult = await checkAdminNationalIdData(national_id);
        if (checkAdminNationalIdDataResult) {
            return msg(res, 400, 'มี (ข้อมูล (national_id) ข้อมูลผู้ดูแลระบบ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateAdminDataResult = await updateAdminData(id, req.body);
        if (updateAdminDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Admin( ข้อมูลผู้ดูแลระบบ )
exports.removeDataAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdAdminDataResult = await checkIdAdminData(id);
        if (!checkIdAdminDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลผู้ดูแลระบบ) อยู่ในระบบ!');
        }

        const removeAdminDataResult = await removeAdminData(id, req.body);
        if (removeAdminDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}