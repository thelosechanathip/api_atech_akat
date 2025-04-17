const db = require('../../config/db');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล SubjectType ( ข้อมูลประเภทวิชา )
exports.getAllDataSubjectTypes = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM subject_types");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAllDataSubjectTypes data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล SubjectType ( ข้อมูลประเภทวิชา )
exports.addDataSubjectType = async (req, res) => {
    try {
        const subjectTypeData = req.body;

        subjectTypeData.created_by = req.name;
        subjectTypeData.updated_by = req.name;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(subjectTypeData).join(", ");
        const values = Object.values(subjectTypeData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO subject_types (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล subject_types
        const [insertStudentResult] = await db.query(sql, values);
        if(insertStudentResult.affectedRows > 0) {
            return msg(res, 200, 'Added successfully!');
        }
    } catch (error) {
        console.error("Error addDataSubjectType data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับอัพเดทข้อมูล SubjectType ( ข้อมูลประเภทวิชา )
exports.updateDataSubjectType = async (req, res) => {
    try {
        const subjectTypeId = req.params.id;
        const subjectTypeData = req.body;

        // อัปเดตข้อมูลพื้นฐาน
        subjectTypeData.updated_by = req.name;

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneSubjectTypeIdResult] = await db.query('SELECT id FROM subject_types WHERE id = ?', [subjectTypeId]);
        if (fetchOneSubjectTypeIdResult.length === 0) return msg(res, 404, `ไม่มีข้อมูล ID: ${subjectTypeId} อยู่ในระบบ!`);

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(subjectTypeData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(subjectTypeData), subjectTypeId];

        const sql = `UPDATE subject_types SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedSubjectTypeResult] = await db.query(sql, values);

        if (updatedSubjectTypeResult.affectedRows > 0) return msg(res, 200, "Updated successfully!");
    } catch (error) {
        console.error("Error updateDataSubjectType data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล SubjectType ( ข้อมูลประเภทวิชา )
exports.removeDataSubjectType = async (req, res) => {
    try {
        const subjectTypeId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdSubjectTypeDataResult] = await db.query(`SELECT id FROM subject_types WHERE id = ?`, [subjectTypeId]);
        if (checkIdSubjectTypeDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${subjectTypeId} ) อยู่ในระบบ!`);

        // ลบข้อมูลจากตาราง subject_types
        const [deleteResult_3] = await db.query('DELETE FROM subject_types WHERE id = ?', [subjectTypeId]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_3.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง subject_types เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM subject_types');
            const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE subject_types AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

            return msg(res, 200, 'Deleted successfully!');
        }
    } catch(error) {
        console.error("Error removeDataSubjectType data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};