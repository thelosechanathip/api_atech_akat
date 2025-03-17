const { 
    fetchReligionsData,
    checkReligionNameThaiData,
    checkReligionNameEnglishData,
    addReligionData,
    checkIdReligionData,
    updateReligionData,
    removeReligionData
} = require('../../models/profileInformations/religionModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Religion (ข้อมูลศาสนา)
exports.getAlldataReligions = async (req, res) => {
    try {
        const fetchReligionDataResults = await fetchReligionsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchReligionDataResults) || fetchReligionDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchReligionDataResults);
    } catch (error) {
        console.error("Error getAlldataReligions data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Religion (ข้อมูลศาสนา)
exports.addDataReligion = async (req, res) => {
    try {
        const { religion_name_thai, religion_name_english } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!religion_name_thai || !religion_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check religion_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkReligionNameThaiDataResult = await checkReligionNameThaiData(religion_name_thai);
        if (checkReligionNameThaiDataResult) return msg(res, 409, 'มี (religion_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check religion_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkReligionNameEnglishDataResult = await checkReligionNameEnglishData(religion_name_english);
        if (checkReligionNameEnglishDataResult) return msg(res, 409, 'มี (religion_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addReligionDataResult = await addReligionData(req.body, req.name);
        if (addReligionDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Religion (ข้อมูลศาสนา)
exports.updateDataReligion = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReligionDataResult = await checkIdReligionData(id);
        if (!checkIdReligionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลศาสนา) อยู่ในระบบ!');

        const { religion_name_thai, religion_name_english } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!religion_name_thai || !religion_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check religion_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkReligionNameThaiDataResult = await checkReligionNameThaiData(religion_name_thai);
        if (checkReligionNameThaiDataResult) return msg(res, 409, 'มี (religion_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check religion_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkReligionNameEnglishDataResult = await checkReligionNameEnglishData(religion_name_english);
        if (checkReligionNameEnglishDataResult) return msg(res, 409, 'มี (religion_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateReligionDataResult = await updateReligionData(id, req.body, req.name);
        if (updateReligionDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Religion (ข้อมูลศาสนา)
exports.removeDataReligion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReligionDataResult = await checkIdReligionData(id);
        if (!checkIdReligionDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลศาสนา) อยู่ในระบบ!');

        const removeReligionDataResult = await removeReligionData(id);
        if (removeReligionDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}