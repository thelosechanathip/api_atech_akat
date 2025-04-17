const db = require('../../config/db');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล CareerGroup ( ข้อมูลกลุ่มอาชีพ )
exports.getAllDataCareerGroup = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM career_group");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAllDataCareerGroup data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล CareerGroup ( ข้อมูลกลุ่มอาชีพ )
exports.addDataCareerGroup = async (req, res) => {
    try {
        const careerGroupData = req.body;

        careerGroupData.created_by = req.name;
        careerGroupData.updated_by = req.name;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(careerGroupData).join(", ");
        const values = Object.values(careerGroupData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO career_group (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล career_group
        const [insertCareerGroupResult] = await db.query(sql, values);
        if(insertCareerGroupResult.affectedRows > 0) {
            return msg(res, 200, 'Added successfully!');
        }
    } catch (error) {
        console.error("Error addDataCareerGroup data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล CareerGroup ( ข้อมูลกลุ่มอาชีพ )
exports.updateDataCareerGroup = async (req, res) => {
    try {
        const careerGroupId = req.params.id;
        const careerGroupData = req.body;

        // อัปเดตข้อมูลพื้นฐาน
        careerGroupData.updated_by = req.name;

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneCareerGroupIdResult] = await db.query('SELECT id FROM career_group WHERE id = ?', [careerGroupId]);
        if (fetchOneCareerGroupIdResult.length === 0) return msg(res, 404, `ไม่มีข้อมูล ID: ${careerGroupId} อยู่ในระบบ!`);

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(careerGroupData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(careerGroupData), careerGroupId];

        const sql = `UPDATE career_group SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedSubjectTypeResult] = await db.query(sql, values);

        if (updatedSubjectTypeResult.affectedRows > 0) return msg(res, 200, "Updated successfully!");
    } catch (error) {
        console.error("Error updateDataCareerGroup data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล CareerGroup ( ข้อมูลกลุ่มอาชีพ )
exports.removeDataCareerGroup = async (req, res) => {
    try {
        const careerGroupId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdCareerGroupDataResult] = await db.query(`SELECT id FROM career_group WHERE id = ?`, [careerGroupId]);
        if (checkIdCareerGroupDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${careerGroupId} ) อยู่ในระบบ!`);

        // ลบข้อมูลจากตาราง career_group
        const [deleteResult_3] = await db.query('DELETE FROM career_group WHERE id = ?', [careerGroupId]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_3.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง career_group เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM career_group');
            const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE career_group AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

            return msg(res, 200, 'Deleted successfully!');
        }
    } catch(error) {
        console.error("Error removeDataCareerGroup data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};