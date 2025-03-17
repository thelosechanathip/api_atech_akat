const { 
    fetchEthnicitiesData,
    checkEthnicityNameThaiData,
    checkEthnicityNameEnglishData,
    addEthnicityData,
    checkIdEthnicityData,
    updateEthnicityData,
    removeEthnicityData
} = require('../../models/profileInformations/ethnicityModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Ethnicity (ข้อมูลเชื้อชาติ)
exports.getAlldataEthnicities = async (req, res) => {
    try {
        const fetchEthnicityDataResults = await fetchEthnicitiesData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchEthnicityDataResults) || fetchEthnicityDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchEthnicityDataResults);
    } catch (error) {
        console.error("Error fetching ethnicity data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Ethnicity (ข้อมูลเชื้อชาติ)
exports.addDataEthnicity = async (req, res) => {
    try {
        const { ethnicity_name_thai, ethnicity_name_english } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!ethnicity_name_thai || !ethnicity_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check ethnicity_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEthnicityNameThaiDataResult = await checkEthnicityNameThaiData(ethnicity_name_thai);
        if (checkEthnicityNameThaiDataResult) return msg(res, 409, 'มี (ethnicity_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check ethnicity_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEthnicityNameEnglishDataResult = await checkEthnicityNameEnglishData(ethnicity_name_english);
        if (checkEthnicityNameEnglishDataResult) return msg(res, 409, 'มี (ethnicity_name_english) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addEthnicityDataResult = await addEthnicityData(req.body, req.name);
        if (addEthnicityDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Ethnicity (ข้อมูลเชื้อชาติ)
exports.updateDataEthnicity = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEthnicityDataResult = await checkIdEthnicityData(id);
        if (!checkIdEthnicityDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลเชื้อชาติ) อยู่ในระบบ!');
        }

        const { ethnicity_name_thai, ethnicity_name_english } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!ethnicity_name_thai || !ethnicity_name_english) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check ethnicity_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEthnicityNameThaiDataResult = await checkEthnicityNameThaiData(ethnicity_name_thai);
        if (checkEthnicityNameThaiDataResult) return msg(res, 409, 'มี (ethnicity_name_thai) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        
        // Check ethnicity_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkEthnicityNameEnglishDataResult = await checkEthnicityNameEnglishData(ethnicity_name_english);
        if (checkEthnicityNameEnglishDataResult) return msg(res, 409, 'มี (ethnicity_name_english) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateEthnicityDataResult = await updateEthnicityData(id, req.body, req.name);
        if (updateEthnicityDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Ethnicity (ข้อมูลเชื้อชาติ)
exports.removeDataEthnicity = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdEthnicityDataResult = await checkIdEthnicityData(id);
        if (!checkIdEthnicityDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลเชื้อชาติ) อยู่ในระบบ!');

        const removeEthnicityDataResult = await removeEthnicityData(id);
        if (removeEthnicityDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}