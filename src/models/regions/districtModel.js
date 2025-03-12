const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล districts จากฐานข้อมูล
exports.fetchDistrictData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM districts"); // Query ข้อมูลจากตาราง districts
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchDistrictData");
    }
}

// Check ว่ามี Code บน Table districts หรือไม่?
exports.checkDistrictCodeData = async (code) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE code = ?", [code]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkDistrictCodeData");
    }
}

// Check ว่ามี NameInThai บน Table districts หรือไม่?
exports.checkDistrictNameInThaiData = async (name_in_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE name_in_thai = ?", [name_in_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkDistrictNameInThaiData");
    }
}

// Check ว่ามี NameInEnglish บน Table districts หรือไม่?
exports.checkDistrictNameInEnglishData = async (name_in_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE name_in_english = ?", [name_in_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkDistrictNameInEnglishData");
    }
}

// Check ว่ามี ProvinceId บน Table districts หรือไม่?
exports.checkDistrictProvinceIdData = async (province_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE id = ?", [province_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkDistrictProvinceIdData");
    }
}

// เพิ่มข้อมูลไปยัง Table districts
exports.addDistrictData = async (data) => {
    try {
        const { code, name_in_thai, name_in_english, province_id } = data;
        const [result] = await db.query(
            `
                INSERT INTO districts (code, name_in_thai, name_in_english, province_id)
                VALUES (?, ?, ?, ?)
            `,
            [code, name_in_thai, name_in_english, province_id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addDistrictData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table districts หรือไม่?
exports.checkIdDistrictData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM districts WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdDistrictData");
    }
};

// อัพเดทข้อมูลไปยัง Table districts
exports.updateDistrictData = async (id, data) => {
    try {
        const { code, name_in_thai, name_in_english, province_id } = data;
        const [result] = await db.query(
            `
                UPDATE districts 
                SET 
                    code = ?,
                    name_in_thai = ?,
                    name_in_english = ?,
                    province_id = ?
                WHERE id = ?
            `,
            [code, name_in_thai, name_in_english, province_id, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateDistrictData");
    }
};

// Check Foreign Key บน Table districts ก่อนลบ
exports.checkFkSubDistrictData = async (id) => {
    try {
        const [result] = await db.query('SELECT district_id FROM sub_districts WHERE id = ?', [id]);
        return result.length > 0;
    } catch (err) {
        console.error('Error while checkFkSubDistrictData:', err.message);
        throw new Error('Failed to checkFkSubDistrictData');
    }
}

// ลบข้อมูลบน Table districts
exports.removeDistrictData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง districts
        const [deleteResult] = await db.query('DELETE FROM districts WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง districts เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM districts');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE districts AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing district data:', err.message);
        throw new Error('Failed to removeDistrictData');
    }
};