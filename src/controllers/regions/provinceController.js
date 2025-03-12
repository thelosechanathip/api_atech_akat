const {
    fetchProvinceData,
    checkProvinceCodeData,
    checkProvinceNameInThaiData,
    checkProvinceNameInEnglishData,
    addProvinceData,
    checkIdProvinceData,
    updateProvinceData,
    checkFkDistrictData,
    removeProvinceData
} = require('../../models/regions/provinceModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Province (ข้อมูลจังหวัด)
exports.getAlldataProvince = async(req, res) => {
    try {
        const fetchProvinceDataResult = await fetchProvinceData();
        if (!Array.isArray(fetchProvinceDataResult) || fetchProvinceDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchProvinceDataResult);
    } catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}

// ใช้สำหรับเพิ่มข้อมูล Province (ข้อมูลจังหวัด)
exports.addDataProvince = async (req, res) => {
    try {
        const { code, name_in_thai, name_in_english } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeDataResult = await checkProvinceCodeData(code);
        if (checkProvinceCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeNameInThaiResult = await checkProvinceNameInThaiData(name_in_thai);
        if (checkProvinceCodeNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeNameInEnglishResult = await checkProvinceNameInEnglishData(name_in_english);
        if (checkProvinceCodeNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addProvinceDataResult = await addProvinceData(req.body);
        if (addProvinceDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Province (ข้อมูลจังหวัด)
exports.updateDataProvince = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdProvinceDataResult = await checkIdProvinceData(id);
        if (!checkIdProvinceDataResult) {
            return msg(res, 404, 'ไม่มี (ข้อมูลจังหวัด) อยู่ในระบบ!');
        }

        const { code, name_in_thai, name_in_english } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!code || !name_in_thai || !name_in_english) {
            return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Check code ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeDataResult = await checkProvinceCodeData(code);
        if (checkProvinceCodeDataResult) {
            return msg(res, 409, 'มี (ข้อมูล (code) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeNameInThaiResult = await checkProvinceNameInThaiData(name_in_thai);
        if (checkProvinceCodeNameInThaiResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_thai) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // Check name_in_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkProvinceCodeNameInEnglishResult = await checkProvinceNameInEnglishData(name_in_english);
        if (checkProvinceCodeNameInEnglishResult) {
            return msg(res, 409, 'มี (ข้อมูล (name_in_english) ข้อมูลจังหวัด) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateProvinceDataResult = await updateProvinceData(id, req.body);
        if (updateProvinceDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Province( ข้อมูลจังหวัด )
exports.removeDataProvince = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdProvinceDataResult = await checkIdProvinceData(id);
        if (!checkIdProvinceDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลจังหวัด) อยู่ในระบบ!');

        const checkFkDistrictDataResult = await checkFkDistrictData(id);
        if(checkFkDistrictDataResult) return msg(res, 400, 'กรุณาลบข้อมูลที่เกี่ยวข้องในข้อมูลอำเภอก่อนลบข้อมูลจังหวัด!');

        const removeProvinceDataResult = await removeProvinceData(id, req.body);
        if (removeProvinceDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}