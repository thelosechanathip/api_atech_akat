const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Prefix จากฐานข้อมูล
exports.fetchPrefixData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM prefixes"); // Query ข้อมูลจากตาราง prefixes
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchPrefixData");
    }
};

// Check ว่ามี PrefixName บน Table prefixes หรือไม่?
exports.checkPrefixNameData = async (prefix_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM prefixes WHERE prefix_name = ?", [prefix_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkPrefixNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table prefixes
exports.addPrefixData = async (data, name) => {
    try {
        const { prefix_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO prefixes (prefix_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [prefix_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addPrefixData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table prefixes หรือไม่?
exports.checkIdPrefixData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM prefixes WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdPrefixData");
    }
};

// อัพเดทข้อมูลไปยัง Table prefixes
exports.updatePrefixData = async (id, data, name) => {
    try {
        const { prefix_name } = data;
        const [result] = await db.query(
            `
                UPDATE prefixes 
                SET 
                    prefix_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [prefix_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updatePrefixData");
    }
};

// ลบข้อมูลบน Table prefixes
exports.removePrefixData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง prefixes
        const [deleteResult] = await db.query('DELETE FROM prefixes WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง prefixes เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM prefixes');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE prefixes AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removePrefixData:', err.message);
        throw new Error('Failed to removePrefixData');
    }
};