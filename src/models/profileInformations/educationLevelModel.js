const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล EducationLevel จากฐานข้อมูล
exports.fetchEducationLevelData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM education_levels"); // Query ข้อมูลจากตาราง education_levels
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchEducationLevelData");
    }
};

// Check ว่ามี EducationLevelAbbreviation บน Table education_levels หรือไม่?
exports.checkEducationLevelAbbreviationData = async (education_level_abbreviation) => {
    try {
        const [rows] = await db.query("SELECT id FROM education_levels WHERE education_level_abbreviation = ?", [education_level_abbreviation]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEducationLevelAbbreviationData");
    }
};

// Check ว่ามี EducationLevelFullName บน Table education_levels หรือไม่?
exports.checkEducationLevelFullNameData = async (education_level_full_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM education_levels WHERE education_level_full_name = ?", [education_level_full_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEducationLevelFullNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table education_levels
exports.addEducationLevelData = async (data, name) => {
    try {
        const { education_level_abbreviation, education_level_full_name} = data;
        const [result] = await db.query(
            `
                INSERT INTO education_levels (education_level_abbreviation, education_level_full_name, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [education_level_abbreviation, education_level_full_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addEducationLevelData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table education_levels หรือไม่?
exports.checkIdEducationLevelData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM education_levels WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdEducationLevelData");
    }
};

// อัพเดทข้อมูลไปยัง Table education_levels
exports.updateEducationLevelData = async (id, data, name) => {
    try {
        const { education_level_abbreviation, education_level_full_name } = data;
        const [result] = await db.query(
            `
                UPDATE education_levels 
                SET 
                    education_level_abbreviation = ?,
                    education_level_full_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [education_level_abbreviation, education_level_full_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateEducationLevelData");
    }
};

// ลบข้อมูลบน Table education_levels
exports.removeEducationLevelData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง education_levels
        const [deleteResult] = await db.query('DELETE FROM education_levels WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง education_levels เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM education_levels');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE education_levels AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeEducationLevelData:', err.message);
        throw new Error('Failed to removeEducationLevelData');
    }
};