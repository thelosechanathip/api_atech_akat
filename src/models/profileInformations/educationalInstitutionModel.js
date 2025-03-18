const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล EducationalInstitution จากฐานข้อมูล
exports.fetchEducationalInstitutionsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM educational_institutions"); // Query ข้อมูลจากตาราง educational_institutions
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchEducationalInstitutionsData");
    }
};

// Check ว่ามี EducationalInstitutionName บน Table educational_institutions หรือไม่?
exports.checkEducationalInstitutionNameData = async (educational_institution_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM educational_institutions WHERE educational_institution_name = ?", [educational_institution_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEducationalInstitutionNameData");
    }
};

// Check ว่ามี InstitutionId บน Table institutions หรือไม่?
exports.checkInstitutionIdData = async (institution_id) => {
    try {
        const [result] = await db.query("SELECT id FROM institutions WHERE id = ?", [institution_id]);
        return result.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkInstitutionIdData");
    }
}

// เพิ่มข้อมูลไปยัง Table educational_institutions
exports.addEducationalInstitutionData = async (data, name) => {
    try {
        const { educational_institution_name, institution_id } = data;
        const [result] = await db.query(
            `
                INSERT INTO educational_institutions (educational_institution_name, institution_id, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [educational_institution_name, institution_id, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addEducationalInstitutionData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table educational_institutions หรือไม่?
exports.checkIdEducationalInstitutionData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM educational_institutions WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdEducationalInstitutionData");
    }
};

// อัพเดทข้อมูลไปยัง Table educational_institutions
exports.updateEducationalInstitutionData = async (id, data, name) => {
    try {
        const { educational_institution_name, institution_id } = data;
        const [result] = await db.query(
            `
                UPDATE educational_institutions 
                SET 
                    educational_institution_name = ?,
                    institution_id = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [educational_institution_name, institution_id, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateEducationalInstitutionData");
    }
};

// ลบข้อมูลบน Table educational_institutions
exports.removeEducationalInstitutionData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง educational_institutions
        const [deleteResult] = await db.query('DELETE FROM educational_institutions WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง educational_institutions เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM educational_institutions');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE educational_institutions AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeEducationalInstitutionData:', err.message);
        throw new Error('Failed to removeEducationalInstitutionData');
    }
};