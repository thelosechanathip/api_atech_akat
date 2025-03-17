const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล EnrollmentTerm จากฐานข้อมูล
exports.fetchEnrollmentTermData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM enrollment_terms"); // Query ข้อมูลจากตาราง enrollment_terms
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchEnrollmentTermData");
    }
};

// Check ว่ามี EnrollmentTermName บน Table enrollment_terms หรือไม่?
exports.checkEnrollmentTermNameData = async (enrollment_term_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM enrollment_terms WHERE enrollment_term_name = ?", [enrollment_term_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEnrollmentTermNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table enrollment_terms
exports.addEnrollmentTermData = async (data, name) => {
    try {
        const { enrollment_term_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO enrollment_terms (enrollment_term_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [enrollment_term_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add enrollment term data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table enrollment_terms หรือไม่?
exports.checkIdEnrollmentTermData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM enrollment_terms WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdEnrollmentTermData");
    }
};

// อัพเดทข้อมูลไปยัง Table enrollment_terms
exports.updateEnrollmentTermData = async (id, data, name) => {
    try {
        const { enrollment_term_name } = data;
        const [result] = await db.query(
            `
                UPDATE enrollment_terms 
                SET 
                    enrollment_term_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [enrollment_term_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateEnrollmentTermData");
    }
};

// ลบข้อมูลบน Table enrollment_terms
exports.removeEnrollmentTermData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง enrollment_terms
        const [deleteResult] = await db.query('DELETE FROM enrollment_terms WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง enrollment_terms เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM enrollment_terms');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE enrollment_terms AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeEnrollmentTermData:', err.message);
        throw new Error('Failed to removeEnrollmentTermData');
    }
};