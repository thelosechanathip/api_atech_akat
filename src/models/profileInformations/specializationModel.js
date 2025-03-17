const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Specialization จากฐานข้อมูล
exports.fetchSpecializationsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM specializations"); // Query ข้อมูลจากตาราง specializations
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchSpecializationsData");
    }
};

// Check ว่ามี SpecializationName บน Table specializations หรือไม่?
exports.checkSpecializationNameData = async (specialization_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM specializations WHERE specialization_name = ?", [specialization_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkSpecializationNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table specializations
exports.addSpecializationData = async (data, name) => {
    try {
        const { specialization_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO specializations (specialization_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [specialization_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addSpecializationData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table specializations หรือไม่?
exports.checkIdSpecializationData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM specializations WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdSpecializationData");
    }
};

// อัพเดทข้อมูลไปยัง Table specializations
exports.updateSpecializationData = async (id, data, name) => {
    try {
        const { specialization_name } = data;
        const [result] = await db.query(
            `
                UPDATE specializations 
                SET 
                    specialization_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [specialization_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateSpecializationData");
    }
};

// ลบข้อมูลบน Table specializations
exports.removeSpecializationData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง specializations
        const [deleteResult] = await db.query('DELETE FROM specializations WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง specializations เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM specializations');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE specializations AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeSpecializationData:', err.message);
        throw new Error('Failed to removeSpecializationData');
    }
};