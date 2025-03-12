const { 
    fetchRoleData, 
    checkRoleNameData, 
    checkRoleDescription, 
    addRoleData,
    checkIdRoleData,
    updateRoleData,
    removeRoleData
} = require('../../models/accountInformations/roleModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Role (ข้อมูลสิทธิ์การใช้งาน)
exports.getAlldataRole = async (req, res) => {
    try {
        const fetchRoleDataResult = await fetchRoleData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchRoleDataResult) || fetchRoleDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchRoleDataResult);
    } catch (error) {
        console.error("Error fetching role data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Role (ข้อมูลสิทธิ์การใช้งาน)
exports.addDataRole = async (req, res) => {
    try {
        const { role_name, description, created_by, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!role_name || !description || !created_by || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');
        }
        // Check role_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRoleNameDataResult = await checkRoleNameData(role_name);
        if (checkRoleNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (role_name) สิทธิ์การใช้งาน) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // Check description ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRoleDescriptionResult = await checkRoleDescription(description);
        if (checkRoleDescriptionResult) {
            return msg(res, 409, 'มี (ข้อมูล (description) สิทธิ์การใช้งาน) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addRoleDataResult = await addRoleData(req.body);
        if (addRoleDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, "internal server errors"); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Role (ข้อมูลสิทธิ์การใช้งาน)
exports.updateDataRole = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdRoleDataResult = await checkIdRoleData(id);
        if (!checkIdRoleDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลสิทธิ์การใช้งาน) อยู่ในระบบ!');
        }

        const { role_name, description, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!role_name || !description || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check role_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRoleNameDataResult = await checkRoleNameData(role_name);
        if (checkRoleNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (role_name) สิทธิ์การใช้งาน) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check description ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRoleDescriptionResult = await checkRoleDescription(description);
        if (checkRoleDescriptionResult) {
            return msg(res, 409, 'มี (ข้อมูล (description) สิทธิ์การใช้งาน) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateRoleDataResult = await updateRoleData(id, req.body);
        if (updateRoleDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, "internal server errors"); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Role( ข้อมูลสิทธิ์การใช้งาน )
exports.removeDataRole = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdRoleDataResult = await checkIdRoleData(id);
        if (!checkIdRoleDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลสิทธิ์การใช้งาน) อยู่ในระบบ!');
        }

        const removeRoleDataResult = await removeRoleData(id, req.body);
        if (removeRoleDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, "internal server errors");
    }
}