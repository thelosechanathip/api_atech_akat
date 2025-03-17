const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Occupation จากฐานข้อมูล
exports.fetchOccupationsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM occupations"); // Query ข้อมูลจากตาราง occupations
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchOccupationsData");
    }
};

// Check ว่ามี OccupationName บน Table occupations หรือไม่?
exports.checkOccupationNameData = async (occupation_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM occupations WHERE occupation_name = ?", [occupation_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkOccupationNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table occupations
exports.addOccupationData = async (data, name) => {
    try {
        const { occupation_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO occupations (occupation_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [occupation_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addOccupationData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table occupations หรือไม่?
exports.checkIdOccupationData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM occupations WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdOccupationData");
    }
};

// อัพเดทข้อมูลไปยัง Table occupations
exports.updateOccupationData = async (id, data, name) => {
    try {
        const { occupation_name } = data;
        const [result] = await db.query(
            `
                UPDATE occupations 
                SET 
                    occupation_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [occupation_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateOccupationData");
    }
};

// ลบข้อมูลบน Table occupations
exports.removeOccupationData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง occupations
        const [deleteResult] = await db.query('DELETE FROM occupations WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง occupations เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM occupations');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE occupations AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeOccupationData:', err.message);
        throw new Error('Failed to removeOccupationData');
    }
};