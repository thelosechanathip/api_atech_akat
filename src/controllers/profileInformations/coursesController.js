const db = require('../../config/db');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.getAlldataCourses = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM courses");
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) return msg(res, 404, "No data found");

        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAlldataCourses data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.addDataCourses = async (req, res) => {
    try {
        const coursesData = req.body;

        coursesData.created_by = req.name;
        coursesData.updated_by = req.name;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(coursesData).join(", ");
        const values = Object.values(coursesData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO courses (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล courses
        const [insertCoursesResult] = await db.query(sql, values);
        if(insertCoursesResult.affectedRows > 0) return msg(res, 200, 'Added successfully!');
    } catch (error) {
        console.error("Error addDataCourses data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับอัพเดทข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.updateDataCourses = async (req, res) => {
    try {
        const coursesId = req.params.id;
        const coursesData = req.body;

        // อัปเดตข้อมูลพื้นฐาน
        coursesData.updated_by = req.name;

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneCoursesIdResult] = await db.query('SELECT id FROM courses WHERE id = ?', [coursesId]);
        if (fetchOneCoursesIdResult.length === 0) return msg(res, 404, `ไม่มีข้อมูล ID: ${coursesId} อยู่ในระบบ!`);

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(coursesData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(coursesData), coursesId];

        const sql = `UPDATE courses SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedCoursesResult] = await db.query(sql, values);
        if (updatedCoursesResult.affectedRows > 0) return msg(res, 200, "Updated successfully!");
    } catch (error) {
        console.error("Error updateDataCourses data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล Courses (ข้อมูลหมวดหมู่วิชา)
exports.removeDataCourses = async (req, res) => {
    try {
        const coursesId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdCoursesDataResult] = await db.query(`SELECT id FROM courses WHERE id = ?`, [coursesId]);
        if (checkIdCoursesDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${coursesId} ) อยู่ในระบบ!`);

        // ลบข้อมูลจากตาราง courses
        const [deleteResult_3] = await db.query('DELETE FROM courses WHERE id = ?', [coursesId]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_3.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง courses เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM courses');
            const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE courses AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

            return msg(res, 200, 'Deleted successfully!');
        }
    } catch(error) {
        console.error("Error removeDataCourses data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
}