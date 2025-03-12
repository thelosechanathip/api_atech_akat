const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Role จากฐานข้อมูล
exports.fetchRoleData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM roles"); // Query ข้อมูลจากตาราง roles
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchRoleData");
    }
};

// Check ว่ามี RoleName บน Table roles หรือไม่?
exports.checkRoleNameData = async (role_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM roles WHERE role_name = ?", [role_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkRoleNameData");
    }
};

// Check ว่ามี Description บน Table roles หรือไม่?
exports.checkRoleDescription = async (description) => {
    try {
        const [rows] = await db.query("SELECT id FROM roles WHERE description = ?", [description]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkRoleDescription");
    }
};

// เพิ่มข้อมูลไปยัง Table roles
exports.addRoleData = async (data) => {
    try {
        const { role_name, description, created_by, updated_by } = data;
        const [result] = await db.query(
            `
                INSERT INTO roles (role_name, description, created_by, updated_by)
                VALUES (?, ?, ?, ?)
            `,
            [role_name, description, created_by, updated_by]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addRoleData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table roles หรือไม่?
exports.checkIdRoleData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM roles WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdRoleData");
    }
};

// อัพเดทข้อมูลไปยัง Table roles
exports.updateRoleData = async (id, data) => {
    try {
        const { role_name, description, updated_by } = data;
        const [result] = await db.query(
            `
                UPDATE roles 
                SET 
                    role_name = ?,
                    description = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [role_name, description, updated_by, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateRoleData");
    }
};

// ลบข้อมูลบน Table roles
exports.removeRoleData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง roles
        const [deleteResult] = await db.query('DELETE FROM roles WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM roles');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE roles AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeRoleData:', err.message);
        throw new Error('Failed to removeRoleData');
    }
};