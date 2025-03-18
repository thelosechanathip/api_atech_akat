const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล sub_districts จากฐานข้อมูล
exports.fetchSubDistrictData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM sub_districts"); // Query ข้อมูลจากตาราง sub_districts
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchSubDistrictData");
    }
}

// ฟังก์ชันสำหรับดึงข้อมูล sub_districts จากฐานข้อมูล
exports.fetchSubDistrictsDataByDistrictId = async (district_id) => {
    try {
        const [rows] = await db.query("SELECT * FROM sub_districts WHERE district_id = ?", [district_id]); // Query ข้อมูลจากตาราง districts
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchSubDistrictsDataByDistrictId");
    }
}

// Check ว่ามี Code บน Table sub_districts หรือไม่?
exports.checkSubDistrictCodeData = async (code) => {
    try {
        const [rows] = await db.query("SELECT id FROM sub_districts WHERE code = ?", [code]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkSubDistrictCodeData");
    }
}

// Check ว่ามี NameInThai บน Table sub_districts หรือไม่?
exports.checkSubDistrictNameInThaiData = async (name_in_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM sub_districts WHERE name_in_thai = ?", [name_in_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkSubDistrictNameInThaiData");
    }
}

// Check ว่ามี NameInEnglish บน Table sub_districts หรือไม่?
exports.checkSubDistrictNameInEnglishData = async (name_in_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM sub_districts WHERE name_in_english = ?", [name_in_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkSubDistrictNameInEnglishData");
    }
}

// Check ว่ามี districtId บน Table districts หรือไม่?
exports.checkSubDistrictDistrictIdData = async (district_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE id = ?", [district_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkSubDistrictDistrictIdData");
    }
}

// เพิ่มข้อมูลไปยัง Table sub_districts
exports.addSubDistrictData = async (data) => {
    try {
        const { code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code } = data;
        const [result] = await db.query(
            `
                INSERT INTO sub_districts (code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addSubDistrictData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table sub_districts หรือไม่?
exports.checkIdSubDistrictData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM sub_districts WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdSubDistrictData");
    }
};

// อัพเดทข้อมูลไปยัง Table sub_districts
exports.updateSubDistrictData = async (id, data) => {
    try {
        const { code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code } = data;
        const [result] = await db.query(
            `
                UPDATE sub_districts 
                SET 
                    code = ?,
                    name_in_thai = ?,
                    name_in_english = ?,
                    latitude = ?,
                    longitude = ?,
                    district_id = ?,
                    zip_code = ?
                WHERE id = ?
            `,
            [code, name_in_thai, name_in_english, latitude, longitude, district_id, zip_code, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateSubDistrictData");
    }
};

// ลบข้อมูลบน Table sub_districts
exports.removeSubDistrictData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง sub_districts
        const [deleteResult] = await db.query('DELETE FROM sub_districts WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง sub_districts เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM sub_districts');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE sub_districts AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeSubDistrictData:', err.message);
        throw new Error('Failed to removeSubDistrictData');
    }
};