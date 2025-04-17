const db = require('../../config/db');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล FieldOfStudy ( ข้อมูลสาขาวิชา )
exports.getAllDataFieldOfStudies = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM field_of_studies");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAllDataFieldOfStudies data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล FieldOfStudy ( ข้อมูลสาขาวิชา )
exports.addDataFieldOfStudy = async (req, res) => {
    try {
        const fieldOfStudyData = req.body;

        fieldOfStudyData.created_by = req.name;
        fieldOfStudyData.updated_by = req.name;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(fieldOfStudyData).join(", ");
        const values = Object.values(fieldOfStudyData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO field_of_studies (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล field_of_studies
        const [insertFieldOfStudyResult] = await db.query(sql, values);
        if(insertFieldOfStudyResult.affectedRows > 0) {
            return msg(res, 200, 'Added successfully!');
        }
    } catch (error) {
        console.error("Error addDataFieldOfStudy data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับอัพเดทข้อมูล FieldOfStudy ( ข้อมูลสาขาวิชา )
exports.updateDataFieldOfStudy = async (req, res) => {
    try {
        const fieldOfStudyId = req.params.id;
        const fieldOfStudyData = req.body;

        // อัปเดตข้อมูลพื้นฐาน
        fieldOfStudyData.updated_by = req.name;

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneFieldOfStudyIdResult] = await db.query('SELECT id FROM field_of_studies WHERE id = ?', [fieldOfStudyId]);
        if (fetchOneFieldOfStudyIdResult.length === 0) return msg(res, 404, `ไม่มีข้อมูล ID: ${fieldOfStudyId} อยู่ในระบบ!`);

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(fieldOfStudyData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(fieldOfStudyData), fieldOfStudyId];

        const sql = `UPDATE field_of_studies SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedSubjectTypeResult] = await db.query(sql, values);

        if (updatedSubjectTypeResult.affectedRows > 0) return msg(res, 200, "Updated successfully!");
    } catch (error) {
        console.error("Error updateDataFieldOfStudy data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล FieldOfStudy ( ข้อมูลสาขาวิชา )
exports.removeDataFieldOfStudy = async (req, res) => {
    try {
        const fieldOfStudyId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdFieldOfStudyDataResult] = await db.query(`SELECT id FROM field_of_studies WHERE id = ?`, [fieldOfStudyId]);
        if (checkIdFieldOfStudyDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${fieldOfStudyId} ) อยู่ในระบบ!`);

        // ลบข้อมูลจากตาราง field_of_studies
        const [deleteResult_3] = await db.query('DELETE FROM field_of_studies WHERE id = ?', [fieldOfStudyId]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_3.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง field_of_studies เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM field_of_studies');
            const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE field_of_studies AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

            return msg(res, 200, 'Deleted successfully!');
        }
    } catch(error) {
        console.error("Error removeDataFieldOfStudy data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};