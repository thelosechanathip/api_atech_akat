const { 
    fetchPositionData,
    checkPositionNameData,
    addPositionData,
    checkIdPositionData,
    updatePositionData,
    removePositionData
} = require('../../models/profileInformations/positionModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Position (ข้อมูลตำแหน่ง)
exports.getAlldataPosition = async (req, res) => {
    try {
        const fetchPositionDataResult = await fetchPositionData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchPositionDataResult) || fetchPositionDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchPositionDataResult);
    } catch (error) {
        console.error("Error fetching position data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Position (ข้อมูลตำแหน่ง)
exports.addDataPosition = async (req, res) => {
    try {
        const { position_name, created_by, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!position_name || !created_by || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        // Check position_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPositionNameDataResult = await checkPositionNameData(position_name);
        if (checkPositionNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (position_name) ตำแหน่ง) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addPositionDataResult = await addPositionData(req.body);
        if (addPositionDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Position (ข้อมูลตำแหน่ง)
exports.updateDataPosition = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPositionDataResult = await checkIdPositionData(id);
        if (!checkIdPositionDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลตำแหน่ง) อยู่ในระบบ!');
        }

        const { position_name, updated_by } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!position_name || !updated_by) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check position_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPositionNameDataResult = await checkPositionNameData(position_name);
        if (checkPositionNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (position_name) ตำแหน่ง) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updatePositionDataResult = await updatePositionData(id, req.body);
        if (updatePositionDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Position( ข้อมูลตำแหน่ง )
exports.removeDataPosition = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPositionDataResult = await checkIdPositionData(id);
        if (!checkIdPositionDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลตำแหน่ง) อยู่ในระบบ!');
        }

        const removePositionDataResult = await removePositionData(id, req.body);
        if (removePositionDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}