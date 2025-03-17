const db = require('../../config/db');
const { capitalizeFirstLetter } = require('../../utils/checkAll');

// ฟังก์ชันสำหรับดึงข้อมูล Ethnicity จากฐานข้อมูล
exports.fetchEthnicitiesData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM ethnicities"); // Query ข้อมูลจากตาราง ethnicities
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchEthnicitiesData");
    }
};

// Check ว่ามี EthnicityNameThai บน Table ethnicities หรือไม่?
exports.checkEthnicityNameThaiData = async (ethnicity_name_thai) => {
    try {
        const [rows] = await db.query("SELECT id FROM ethnicities WHERE ethnicity_name_thai = ?", [ethnicity_name_thai]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEthnicityNameThaiData");
    }
};

// Check ว่ามี EthnicityNameEnglish บน Table ethnicities หรือไม่?
exports.checkEthnicityNameEnglishData = async (ethnicity_name_english) => {
    try {
        const [rows] = await db.query("SELECT id FROM ethnicities WHERE ethnicity_name_english = ?", [ethnicity_name_english]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkEthnicityNameEnglishData");
    }
};

// เพิ่มข้อมูลไปยัง Table ethnicities
exports.addEthnicityData = async (data, name) => {
    try {
        const { ethnicity_name_thai, ethnicity_name_english } = data;
        const checkCapitalizeFirstLetter = await capitalizeFirstLetter(ethnicity_name_english);
        const [result] = await db.query(
            `
                INSERT INTO ethnicities (ethnicity_name_thai, ethnicity_name_english, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [ethnicity_name_thai, checkCapitalizeFirstLetter, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addEthnicityData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table ethnicities หรือไม่?
exports.checkIdEthnicityData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM ethnicities WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdEthnicityData");
    }
};

// อัพเดทข้อมูลไปยัง Table ethnicities
exports.updateEthnicityData = async (id, data, name) => {
    try {
        const { ethnicity_name_thai, ethnicity_name_english } = data;
        const checkCapitalizeFirstLetter = await capitalizeFirstLetter(ethnicity_name_english);
        const [result] = await db.query(
            `
                UPDATE ethnicities 
                SET 
                    ethnicity_name_thai = ?,
                    ethnicity_name_english = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [ethnicity_name_thai, checkCapitalizeFirstLetter, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateEthnicityData");
    }
};

// ลบข้อมูลบน Table ethnicities
exports.removeEthnicityData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง ethnicities
        const [deleteResult] = await db.query('DELETE FROM ethnicities WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง ethnicities เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM ethnicities');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE ethnicities AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeEnrollmentYearData:', err.message);
        throw new Error('Failed to removeEnrollmentYearData');
    }
};