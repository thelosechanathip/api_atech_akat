const db = require('../../config/db');
const { capitalizeFirstLetter } = require('../../utils/checkAll');

// ฟังก์ชันสำหรับดึงข้อมูล Nationality จากฐานข้อมูล
exports.fetchNationalitiesData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM nationalities"); // Query ข้อมูลจากตาราง nationalities
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchNationalitiesData");
    }
};

// Check ว่ามี NationalityName บน Table nationalities หรือไม่?
exports.checkNationalityNameThaiData = async (nationality_name_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM nationalities WHERE nationality_name_thai = ?", [nationality_name_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkNationalityNameThaiData");
    }
};

// Check ว่ามี NationalityName บน Table nationalities หรือไม่?
exports.checkNationalityNameEnglishData = async (nationality_name_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM nationalities WHERE nationality_name_english = ?", [nationality_name_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkNationalityNameEnglishData");
    }
};

// เพิ่มข้อมูลไปยัง Table nationalities
exports.addNationalityData = async (data, name) => {
    try {
        const { nationality_name_thai, nationality_name_english } = data;
        const capitalizeFirstLetterResult = capitalizeFirstLetter(nationality_name_english);
        const [result] = await db.query(
            `
                INSERT INTO nationalities (nationality_name_thai, nationality_name_english, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [nationality_name_thai, capitalizeFirstLetterResult, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addNationalityData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table nationalities หรือไม่?
exports.checkIdNationalityData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM nationalities WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdNationalitysData");
    }
};

// อัพเดทข้อมูลไปยัง Table nationalities
exports.updateNationalityData = async (id, data, name) => {
    try {
        const { nationality_name_thai, nationality_name_english } = data;
        const capitalizeFirstLetterResult = capitalizeFirstLetter(nationality_name_english);
        const [result] = await db.query(
            `
                UPDATE nationalities 
                SET 
                    nationality_name_thai = ?,
                    nationality_name_english = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [nationality_name_thai, capitalizeFirstLetterResult, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateNationalityData");
    }
};

// ลบข้อมูลบน Table nationalities
exports.removeNationalityData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง nationalities
        const [deleteResult] = await db.query('DELETE FROM nationalities WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง nationalities เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM nationalities');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE nationalities AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeNationalityData:', err.message);
        throw new Error('Failed to removeNationalityData');
    }
};