const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Religion จากฐานข้อมูล
exports.fetchReligionsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM religions"); // Query ข้อมูลจากตาราง religions
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchReligionsData");
    }
};

// Check ว่ามี ReligionName บน Table religions หรือไม่?
exports.checkReligionNameThaiData = async (religion_name_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM religions WHERE religion_name_thai = ?", [religion_name_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReligionNameThaiData");
    }
};

// Check ว่ามี ReligionName บน Table religions หรือไม่?
exports.checkReligionNameEnglishData = async (religion_name_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM religions WHERE religion_name_english = ?", [religion_name_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReligionNameEnglishData");
    }
};

// เพิ่มข้อมูลไปยัง Table religions
exports.addReligionData = async (data, name) => {
    try {
        const { religion_name_thai, religion_name_english } = data;
        const [result] = await db.query(
            `
                INSERT INTO religions (religion_name_thai, religion_name_english, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [religion_name_thai, religion_name_english, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addReligionData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table religions หรือไม่?
exports.checkIdReligionData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM religions WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdRelationData");
    }
};

// อัพเดทข้อมูลไปยัง Table religions
exports.updateReligionData = async (id, data, name) => {
    try {
        const { religion_name_thai, religion_name_english } = data;
        const [result] = await db.query(
            `
                UPDATE religions 
                SET 
                    religion_name_thai = ?,
                    religion_name_english = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [religion_name_thai, religion_name_english, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateReligionData");
    }
};

// ลบข้อมูลบน Table religions
exports.removeReligionData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง religions
        const [deleteResult] = await db.query('DELETE FROM religions WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง religions เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM religions');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE religions AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeReligionData:', err.message);
        throw new Error('Failed to removeReligionData');
    }
};