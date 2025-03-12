const { 
    fetchGenderData,
    checkGenderNameData,
    addGenderData,
    checkIdGenderData,
    updateGenderData,
    removeGenderData
} = require('../../models/profileInformations/genderModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Gender (ข้อมูลเพศ)
exports.getAlldataGender = async (req, res) => {
    try {
        const fetchGenderDataResult = await fetchGenderData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchGenderDataResult) || fetchGenderDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchGenderDataResult);
    } catch (error) {
        console.error("Error fetching gender data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Gender (ข้อมูลเพศ)
exports.addDataGender = async (req, res) => {
    try {
        const { gender_name, created_by, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!gender_name || !created_by || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check gender_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkGenderNameDataResult = await checkGenderNameData(gender_name);
        if (checkGenderNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (gender_name) เพศ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addGenderDataResult = await addGenderData(req.body);
        if (addGenderDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Gender (ข้อมูลเพศ)
exports.updateDataGender = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdGenderDataResult = await checkIdGenderData(id);
        if (!checkIdGenderDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลเพศ) อยู่ในระบบ!');
        }

        const { gender_name, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!gender_name || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check gender_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkGenderNameDataResult = await checkGenderNameData(gender_name);
        if (checkGenderNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (gender_name) เพศ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateGenderDataResult = await updateGenderData(id, req.body);
        if (updateGenderDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Gender( ข้อมูลเพศ )
exports.removeDataGender = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdGenderDataResult = await checkIdGenderData(id);
        if (!checkIdGenderDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลเพศ) อยู่ในระบบ!');
        }

        const removeGenderDataResult = await removeGenderData(id, req.body);
        if (removeGenderDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    } catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}