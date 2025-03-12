const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล provinces จากฐานข้อมูล
exports.fetchProvinceData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM provinces"); // Query ข้อมูลจากตาราง provinces
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchProvinceData");
    }
}

// Check ว่ามี Code บน Table provinces หรือไม่?
exports.checkProvinceCodeData = async (code) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE code = ?", [code]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkProvinceCodeData");
    }
}

// Check ว่ามี NameInThai บน Table provinces หรือไม่?
exports.checkProvinceNameInThaiData = async (name_in_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE name_in_thai = ?", [name_in_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkProvinceNameInThaiData");
    }
}

// Check ว่ามี NameInEnglish บน Table provinces หรือไม่?
exports.checkProvinceNameInEnglishData = async (name_in_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE name_in_english = ?", [name_in_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkProvinceNameInEnglishData");
    }
}

// เพิ่มข้อมูลไปยัง Table provinces
exports.addProvinceData = async (data) => {
    try {
        const { code, name_in_thai, name_in_english } = data;
        const [result] = await db.query(
            `
                INSERT INTO provinces (code, name_in_thai, name_in_english)
                VALUES (?, ?, ?)
            `,
            [code, name_in_thai, name_in_english]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addProvinceData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table provinces หรือไม่?
exports.checkIdProvinceData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM provinces WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdProvinceData");
    }
};

// อัพเดทข้อมูลไปยัง Table provinces
exports.updateProvinceData = async (id, data) => {
    try {
        const { code, name_in_thai, name_in_english } = data;
        const [result] = await db.query(
            `
                UPDATE provinces 
                SET 
                    code = ?,
                    name_in_thai = ?,
                    name_in_english = ?
                WHERE id = ?
            `,
            [code, name_in_thai, name_in_english, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateProvinceData");
    }
};

// Check Foreign Key บน Table districts ก่อนลบ
exports.checkFkDistrictData = async (id) => {
    try {
        const [result] = await db.query('SELECT province_id FROM districts WHERE id = ?', [id]);
        return result.length > 0;
    } catch (err) {
        console.error('Error while checkFkDistrictData:', err.message);
        throw new Error('Failed to checkFkDistrictData');
    }
}

// ลบข้อมูลบน Table provinces
exports.removeProvinceData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง provinces
        const [deleteResult] = await db.query('DELETE FROM provinces WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง provinces เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM provinces');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE provinces AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing province data:', err.message);
        throw new Error('Failed to removeProvinceData');
    }
};