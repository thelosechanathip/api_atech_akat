const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Courses จากฐานข้อมูล
exports.fetchCoursesData = async () => {
    try {
        const [rows] = await db.query(
            `
                SELECT 
                    cs.id,
                    cs.subject_type,
                    cs.career_group,
                    cs.field_of_study,
                    el.education_level_abbreviation,
                    el.education_level_full_name,
                    cs.created_at,
                    cs.created_by,
                    cs.updated_at,
                    cs.updated_by
                FROM courses AS cs
                LEFT OUTER JOIN education_levels AS el ON cs.education_level_id = el.id
            `
        ); // Query ข้อมูลจากตาราง courses
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchCoursesData");
    }
};

// Check ว่ามี EducationLevelId บน Table education_levels หรือไม่?
exports.CheckIdEducationLevel = async (education_level_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM education_levels WHERE id = ?", [education_level_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to CheckIdEducationLevel");
    }
};

// เพิ่มข้อมูลไปยัง Table courses
exports.addCoursesData = async (data, name) => {
    try {
        const { subject_type, career_group, field_of_study, education_level_id } = data;
        const [result] = await db.query(
            `
                INSERT INTO courses (subject_type, career_group, field_of_study, education_level_id, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [subject_type, career_group, field_of_study, education_level_id, name, name]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addCoursesData");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table courses หรือไม่?
exports.checkIdCoursesData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM courses WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdCoursesData");
    }
};

// อัพเดทข้อมูลไปยัง Table courses
exports.updateCoursesData = async (id, data, name) => {
    try {
        const { subject_type, career_group, field_of_study, education_level_id } = data;
        const [result] = await db.query(
            `
                UPDATE courses 
                SET 
                    subject_type = ?,
                    career_group = ?,
                    field_of_study = ?,
                    education_level_id = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [subject_type, career_group, field_of_study, education_level_id, name, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateCoursesData");
    }
};

// ลบข้อมูลบน Table courses
exports.removeCoursesData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง courses
        const [deleteResult] = await db.query('DELETE FROM courses WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง courses เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM courses');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE courses AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeCoursesData:', err.message);
        throw new Error('Failed to removeCoursesData');
    }
};