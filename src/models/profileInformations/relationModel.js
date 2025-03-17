const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Relation จากฐานข้อมูล
exports.fetchRelationsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM relations"); // Query ข้อมูลจากตาราง relations
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchRelationsData");
    }
};

// Check ว่ามี Relation บน Table relations หรือไม่?
exports.checkRelationNameData = async (relation_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM relations WHERE relation_name = ?", [relation_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkRelationNameData");
    }
};

// เพิ่มข้อมูลไปยัง Table relations
exports.addRelationData = async (data, name) => {
    try {
        const { relation_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO relations (relation_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [relation_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addRelationData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table relations หรือไม่?
exports.checkIdRelationData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM relations WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdRelationData");
    }
};

// อัพเดทข้อมูลไปยัง Table relations
exports.updateRelationData = async (id, data, name) => {
    try {
        const { relation_name } = data;
        const [result] = await db.query(
            `
                UPDATE relations 
                SET 
                    relation_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [relation_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateRelationData");
    }
};

// ลบข้อมูลบน Table relations
exports.removeRelationData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง relations
        const [deleteResult] = await db.query('DELETE FROM relations WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง relations เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM relations');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE relations AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeRelationData:', err.message);
        throw new Error('Failed to removeRelationData');
    }
};