const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล EnrollmentYear จากฐานข้อมูล
exports.fetchEnrollmentYearData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM enrollment_years"); // Query ข้อมูลจากตาราง enrollment_years
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchEnrollmentYearData");
    }
};

// Check ว่ามี EnrollmentYearName บน Table enrollment_years หรือไม่?
exports.checkEnrollmentYearNameData = async (enrollment_year_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM enrollment_years WHERE enrollment_year_name = ?", [enrollment_year_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEnrollmentYearNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table enrollment_years
exports.addEnrollmentYearData = async (data, name) => {
    try {
        const { enrollment_year_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO enrollment_years (enrollment_year_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [enrollment_year_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addEnrollmentYearData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table enrollment_years หรือไม่?
exports.checkIdEnrollmentYearData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM enrollment_years WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdEnrollmentYearData");
    }
};

// อัพเดทข้อมูลไปยัง Table enrollment_years
exports.updateEnrollmentYearData = async (id, data, name) => {
    try {
        const { enrollment_year_name } = data;
        const [result] = await db.query(
            `
                UPDATE enrollment_years 
                SET 
                    enrollment_year_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [enrollment_year_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateEnrollmentYearData");
    }
};

// ลบข้อมูลบน Table enrollment_years
exports.removeEnrollmentYearData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง enrollment_years
        const [deleteResult] = await db.query('DELETE FROM enrollment_years WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง enrollment_years เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM enrollment_years');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE enrollment_years AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeEnrollmentYearData:', err.message);
        throw new Error('Failed to removeEnrollmentYearData');
    }
};