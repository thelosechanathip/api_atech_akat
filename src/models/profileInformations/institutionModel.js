const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Institution จากฐานข้อมูล
exports.fetchInstitutionsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM institutions"); // Query ข้อมูลจากตาราง institutions
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchInstitutionsData");
    }
};

// Check ว่ามี InstitutionName บน Table institutions หรือไม่?
exports.checkInstitutionNameData = async (institution_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM institutions WHERE institution_name = ?", [institution_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkInstitutionNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table institutions
exports.addInstitutionData = async (data, name) => {
    try {
        const { institution_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO institutions (institution_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [institution_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addInstitutionData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table institutions หรือไม่?
exports.checkIdInstitutionData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM institutions WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdInstitutionData");
    }
};

// อัพเดทข้อมูลไปยัง Table institutions
exports.updateInstitutionData = async (id, data, name) => {
    try {
        const { institution_name } = data;
        const [result] = await db.query(
            `
                UPDATE institutions 
                SET 
                    institution_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [institution_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateInstitutionData");
    }
};

// ลบข้อมูลบน Table institutions
exports.removeInstitutionData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง institutions
        const [deleteResult] = await db.query('DELETE FROM institutions WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง institutions เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM institutions');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE institutions AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeInstitutionData:', err.message);
        throw new Error('Failed to removeInstitutionData');
    }
};