const { 
    fetchOccupationsData,
    checkOccupationNameData,
    addOccupationData,
    checkIdOccupationData,
    updateOccupationData,
    removeOccupationData
} = require('../../models/profileInformations/occupationModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Occupation (ข้อมูลอาชีพ)
exports.getAlldataOccupations = async (req, res) => {
    try {
        const fetchOccupationDataResults = await fetchOccupationsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchOccupationDataResults) || fetchOccupationDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchOccupationDataResults);
    } catch (error) {
        console.error("Error getAlldataOccupations data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Occupation (ข้อมูลอาชีพ)
exports.addDataOccupation = async (req, res) => {
    try {
        const { occupation_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!occupation_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check occupation_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkOccupationNameDataResult = await checkOccupationNameData(occupation_name);
        if (checkOccupationNameDataResult) return msg(res, 409, 'มี (occupation_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addOccupationDataResult = await addOccupationData(req.body, req.name);
        if (addOccupationDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Occupation (ข้อมูลอาชีพ)
exports.updateDataOccupation = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdOccupationDataResult = await checkIdOccupationData(id);
        if (!checkIdOccupationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลอาชีพ) อยู่ในระบบ!');

        const { occupation_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!occupation_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check occupation_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkOccupationNameDataResult = await checkOccupationNameData(occupation_name);
        if (checkOccupationNameDataResult) return msg(res, 409, 'มี (occupation_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateOccupationDataResult = await updateOccupationData(id, req.body, req.name);
        if (updateOccupationDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Occupation (ข้อมูลอาชีพ)
exports.removeDataOccupation = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdOccupationDataResult = await checkIdOccupationData(id);
        if (!checkIdOccupationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลอาชีพ) อยู่ในระบบ!');

        const removeOccupationDataResult = await removeOccupationData(id);
        if (removeOccupationDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}