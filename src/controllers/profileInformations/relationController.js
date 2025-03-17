const { 
    fetchRelationsData,
    checkRelationNameData,
    addRelationData,
    checkIdRelationData,
    updateRelationData,
    removeRelationData
} = require('../../models/profileInformations/relationModel.js');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Relation (ข้อมูลความสัมพันธ์)
exports.getAlldataRelations = async (req, res) => {
    try {
        const fetchRelationDataResults = await fetchRelationsData(); // เรียกใช้ฟังก์ชันโดยตรง
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchRelationDataResults) || fetchRelationDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchRelationDataResults);
    } catch (error) {
        console.error("Error getAlldataRelations data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Relation (ข้อมูลความสัมพันธ์)
exports.addDataRelation = async (req, res) => {
    try {
        const { relation_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!relation_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check relation_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRelationNameDataResult = await checkRelationNameData(relation_name);
        if (checkRelationNameDataResult) return msg(res, 409, 'มี (relation_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addRelationDataResult = await addRelationData(req.body, req.name);
        if (addRelationDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Relation (ข้อมูลความสัมพันธ์)
exports.updateDataRelation = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdRelationDataResult = await checkIdRelationData(id);
        if (!checkIdRelationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลความสัมพันธ์) อยู่ในระบบ!');

        const { relation_name } = req.body;
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!relation_name) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check relation_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkRelationNameDataResult = await checkRelationNameData(relation_name);
        if (checkRelationNameDataResult) return msg(res, 409, 'มี (relation_name) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateRelationDataResult = await updateRelationData(id, req.body, req.name);
        if (updateRelationDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Relation (ข้อมูลความสัมพันธ์)
exports.removeDataRelation = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdRelationDataResult = await checkIdRelationData(id);
        if (!checkIdRelationDataResult) return msg(res, 404, 'ไม่มี (ข้อมูลความสัมพันธ์) อยู่ในระบบ!');

        const removeRelationDataResult = await removeRelationData(id);
        if (removeRelationDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}