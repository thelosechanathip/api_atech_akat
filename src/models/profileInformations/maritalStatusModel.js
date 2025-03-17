const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล MaritalStatus จากฐานข้อมูล
exports.fetchMaritalStatusData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM marital_status"); // Query ข้อมูลจากตาราง marital_status
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchMaritalStatusData");
    }
};

// Check ว่ามี MaritalStatusName บน Table marital_status หรือไม่?
exports.checkMaritalStatusNameData = async (marital_status_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM marital_status WHERE marital_status_name = ?", [marital_status_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkMaritalStatusNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table marital_status
exports.addMaritalStatusData = async (data, name) => {
    try {
        const { marital_status_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO marital_status (marital_status_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [marital_status_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addMaritalStatusData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table marital_status หรือไม่?
exports.checkIdMaritalStatusData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM marital_status WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdMaritalStatusData");
    }
};

// อัพเดทข้อมูลไปยัง Table marital_status
exports.updateMaritalStatusData = async (id, data, name) => {
    try {
        const { marital_status_name } = data;
        const [result] = await db.query(
            `
                UPDATE marital_status 
                SET 
                    marital_status_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [marital_status_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateMaritalStatusData");
    }
};

// ลบข้อมูลบน Table marital_status
exports.removeMaritalStatusData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง marital_status
        const [deleteResult] = await db.query('DELETE FROM marital_status WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง marital_status เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM marital_status');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE marital_status AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeMaritalStatusData:', err.message);
        throw new Error('Failed to removeMaritalStatusData');
    }
};