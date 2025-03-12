const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล TeacherStatus จากฐานข้อมูล
exports.fetchTeacherStatusData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM teacher_status"); // Query ข้อมูลจากตาราง teacher_status
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch teacher status data");
    }
};

// Check ว่ามี TeacherStatusName บน Table teacher_status หรือไม่?
exports.checkTeacherStatusNameData = async (teacher_status_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM teacher_status WHERE teacher_status_name = ?", [teacher_status_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check teacher_status_name data");
    }
};

// เพิ่มข้อมูลไปยัง Table teacher_status
exports.addTeacherStatusData = async (data, name) => {
    try {
        const { teacher_status_name } = data;
        const [result] = await db.query(
            `
                INSERT INTO teacher_status (teacher_status_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [teacher_status_name, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add teacher status data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table teacher_status หรือไม่?
exports.checkIdTeacherStatusData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM teacher_status WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check id data");
    }
};

// อัพเดทข้อมูลไปยัง Table teacher_status
exports.updateTeacherStatusData = async (id, data, name) => {
    try {
        const { teacher_status_name } = data;
        const [result] = await db.query(
            `
                UPDATE teacher_status 
                SET 
                    teacher_status_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [teacher_status_name, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update teacher status data");
    }
};

// ลบข้อมูลบน Table teacher_status
exports.removeTeacherStatusData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง teacher_status
        const [deleteResult] = await db.query('DELETE FROM teacher_status WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง teacher_status เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM teacher_status');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE teacher_status AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing teacher status data:', err.message);
        throw new Error('Failed to remove teacher status data');
    }
};