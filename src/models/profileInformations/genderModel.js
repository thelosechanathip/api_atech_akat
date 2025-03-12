const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Gender จากฐานข้อมูล
exports.fetchGenderData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM genders"); // Query ข้อมูลจากตาราง genders
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchGenderData");
    }
};

// Check ว่ามี GenderName บน Table genders หรือไม่?
exports.checkGenderNameData = async (gender_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM genders WHERE gender_name = ?", [gender_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkGenderNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table genders
exports.addGenderData = async (data, name) => {
    try {
        const { gender_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO genders (gender_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [gender_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addGenderData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table genders หรือไม่?
exports.checkIdGenderData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM genders WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdGenderData");
    }
};

// อัพเดทข้อมูลไปยัง Table genders
exports.updateGenderData = async (id, data, name) => {
    try {
        const { gender_name } = data;
        const [result] = await db.query(
            `
                UPDATE genders 
                SET 
                    gender_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [gender_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateGenderData");
    }
};

// ลบข้อมูลบน Table genders
exports.removeGenderData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง genders
        const [deleteResult] = await db.query('DELETE FROM genders WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง genders เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM genders');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE genders AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeGenderData:', err.message);
        throw new Error('Failed to removeGenderData');
    }
};