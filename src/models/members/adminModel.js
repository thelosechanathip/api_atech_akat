const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Admin จากฐานข้อมูล
exports.fetchAdminData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM admins"); // Query ข้อมูลจากตาราง admins
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchAdminData");
    }
};

// Check ว่ามี PrefixId บน Table prefixes หรือไม่?
exports.checkAdminPrefixIdData = async (prefix_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM prefixes WHERE id = ?", [prefix_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkAdminPrefixIdData");
    }
};

// Check ว่ามี NationalId บน Table admins หรือไม่?
exports.checkAdminNationalIdData = async (national_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM admins WHERE id = ?", [national_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkAdminNationalIdData");
    }
};

// เพิ่มข้อมูลไปยัง Table admins
exports.addAdminData = async (data) => {
    try {
        const { prefix_id, first_name_thai, last_name_thai, national_id, image, created_by, updated_by } = data;
        // จัดการแปลง Base64 ให้กลายเป็น Buffer Binary
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary
        const [result] = await db.query(
            `
                INSERT INTO admins (prefix_id, first_name_thai, last_name_thai, national_id, image, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [prefix_id, first_name_thai, last_name_thai, national_id, imageBuffer, created_by, updated_by]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addAdminData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table admins หรือไม่?
exports.checkIdAdminData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM admins WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdAdminData");
    }
};

// อัพเดทข้อมูลไปยัง Table admins
exports.updateAdminData = async (id, data) => {
    try {
        const { prefix_id, first_name_thai, last_name_thai, national_id, image, updated_by } = data;
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary
        const [result] = await db.query(
            `
                UPDATE admins 
                SET 
                    prefix_id = ?,
                    first_name_thai = ?,
                    last_name_thai = ?,
                    national_id = ?,
                    image = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [prefix_id, first_name_thai, last_name_thai, national_id, imageBuffer, updated_by, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateAdminData");
    }
};

// ลบข้อมูลบน Table admins
exports.removeAdminData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง admins
        const [deleteResult] = await db.query('DELETE FROM admins WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง admins เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM admins');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE admins AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeAdminData:', err.message);
        throw new Error('Failed to removeAdminData');
    }
};