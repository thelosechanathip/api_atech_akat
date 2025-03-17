const { 
    fetchNationalitiesData,
    checkNationalityNameThaiData,
    checkNationalityNameEnglishData,
    addNationalityData,
    checkIdNationalityData,
    updateNationalityData,
    removeNationalityData
} = require('../../models/profileInformations/nationalityModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Nationality (ข้อมูลสัญชาติ)
exports.getAlldataNationalities = async (req, res) => {
    try {
        const fetchNationalityDataResults = await fetchNationalitiesData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchNationalityDataResults) || fetchNationalityDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchNationalityDataResults);
    } catch (error) {
        console.error("Error getAlldataNationalities data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Nationality (ข้อมูลสัญชาติ)
exports.addDataNationality = async (req, res) => {
    try {
        const { nationality_name_thai, nationality_name_english } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!nationality_name_thai || !nationality_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check nationality_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkNationalityNameThaiDataResult = await checkNationalityNameThaiData(nationality_name_thai);
        if (checkNationalityNameThaiDataResult) return msg(res, 409, 'มี (nationality_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check nationality_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkNationalityNameEnglishDataResult = await checkNationalityNameEnglishData(nationality_name_english);
        if (checkNationalityNameEnglishDataResult) return msg(res, 409, 'มี (nationality_name_english) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addNationalityDataResult = await addNationalityData(req.body, req.name);
        if (addNationalityDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Nationality (ข้อมูลสัญชาติ)
exports.updateDataNationality = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdNationalityDataResult = await checkIdNationalityData(id);
        if (!checkIdNationalityDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสัญชาติ) อยู่ในระบบ!');

        const { nationality_name_thai, nationality_name_english } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!nationality_name_thai || !nationality_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check nationality_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkNationalityNameThaiDataResult = await checkNationalityNameThaiData(nationality_name_thai);
        if (checkNationalityNameThaiDataResult) return msg(res, 409, 'มี (nationality_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check nationality_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkNationalityNameEnglishDataResult = await checkNationalityNameEnglishData(nationality_name_english);
        if (checkNationalityNameEnglishDataResult) return msg(res, 409, 'มี (nationality_name_english) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateNationalityDataResult = await updateNationalityData(id, req.body, req.name);
        if (updateNationalityDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Nationality (ข้อมูลสัญชาติ)
exports.removeDataNationality = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdNationalityDataResult = await checkIdNationalityData(id);
        if (!checkIdNationalityDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลสัญชาติ) อยู่ในระบบ!');

        const removeNationalityDataResult = await removeNationalityData(id);
        if (removeNationalityDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}