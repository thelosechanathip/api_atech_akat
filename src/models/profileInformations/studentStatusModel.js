const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล StudentStatus จากฐานข้อมูล
exports.fetchStudentStatusData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM student_status"); // Query ข้อมูลจากตาราง student_status
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch student status data");
    }
};

// Check ว่ามี StudentStatusName บน Table student_status หรือไม่?
exports.checkStudentStatusNameData = async (student_status_name) => {
    try {
        const [rows] = await db.query("SELECT id FROM student_status WHERE student_status_name = ?", [student_status_name]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check student_status_name data");
    }
};

// เพิ่มข้อมูลไปยัง Table student_status
exports.addStudentStatusData = async (data) => {
    try {
        const { student_status_name, created_by, updated_by } = data;
        const [result] = await db.query(
            `
                INSERT INTO student_status (student_status_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [student_status_name, created_by, updated_by]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add student status data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table student_status หรือไม่?
exports.checkIdStudentStatusData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM student_status WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check id data");
    }
};

// อัพเดทข้อมูลไปยัง Table student_status
exports.updateStudentStatusData = async (id, data) => {
    try {
        const { student_status_name, updated_by } = data;
        const [result] = await db.query(
            `
                UPDATE student_status 
                SET 
                    student_status_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [student_status_name, updated_by, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update student status data");
    }
};

// ลบข้อมูลบน Table student_status
exports.removeStudentStatusData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง student_status
        const [deleteResult] = await db.query('DELETE FROM student_status WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง student_status เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM student_status');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE student_status AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing student status data:', err.message);
        throw new Error('Failed to remove student status data');
    }
};