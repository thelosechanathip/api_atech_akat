const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Position จากฐานข้อมูล
exports.fetchPositionData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM positions"); // Query ข้อมูลจากตาราง positions
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch position data");
    }
};

// Check ว่ามี PositionName บน Table positions หรือไม่?
exports.checkPositionNameData = async (position_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM positions WHERE position_name = ?", [position_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check position_name data");
    }
};

// เพิ่มข้อมูลไปยัง Table positions
exports.addPositionData = async (data, name) => {
    try {
        const { position_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO positions (position_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [position_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add position data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table positions หรือไม่?
exports.checkIdPositionData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM positions WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check id data");
    }
};

// อัพเดทข้อมูลไปยัง Table positions
exports.updatePositionData = async (id, data, name) => {
    try {
        const { position_name } = data;
        const [result] = await db.query(
            `
                UPDATE positions 
                SET 
                    position_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [position_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update position data");
    }
};

// ลบข้อมูลบน Table positions
exports.removePositionData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง positions
        const [deleteResult] = await db.query('DELETE FROM positions WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง positions เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM positions');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE positions AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing position data:', err.message);
        throw new Error('Failed to remove position data');
    }
};