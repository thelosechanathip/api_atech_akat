const { 
    fetchPrefixData,
    checkPrefixNameData,
    addPrefixData,
    checkIdPrefixData,
    updatePrefixData,
    removePrefixData
} = require('../../models/profileInformations/prefixModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Prefix (ข้อมูลคำนำหน้า)
exports.getAlldataPrefix = async (req, res) => {
    try {
        const fetchPrefixDataResult = await fetchPrefixData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchPrefixDataResult) || fetchPrefixDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchPrefixDataResult);
    } catch (error) {
        console.error("Error fetching enrollment year data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Prefix (ข้อมูลคำนำหน้า)
exports.addDataPrefix = async (req, res) => {
    try {
        const { prefix_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!prefix_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');
        }
        // Check prefix_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPrefixNameDataResult = await checkPrefixNameData(prefix_name);
        if (checkPrefixNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (prefix_name) คำนำหน้า) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addPrefixDataResult = await addPrefixData(req.body, req.name);
        if (addPrefixDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Prefix (ข้อมูลคำนำหน้า)
exports.updateDataPrefix = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPrefixDataResult = await checkIdPrefixData(id);
        if (!checkIdPrefixDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลคำนำหน้า) อยู่ในระบบ!');
        }

        const { prefix_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!prefix_name) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check prefix_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPrefixNameDataResult = await checkPrefixNameData(prefix_name);
        if (checkPrefixNameDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (prefix_name) คำนำหน้า) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updatePrefixDataResult = await updatePrefixData(id, req.body, req.name);
        if (updatePrefixDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Prefix( ข้อมูลคำนำหน้า )
exports.removeDataPrefix = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPrefixDataResult = await checkIdPrefixData(id);
        if (!checkIdPrefixDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลคำนำหน้า) อยู่ในระบบ!');
        }

        const removePrefixDataResult = await removePrefixData(id, req.body);
        if (removePrefixDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}