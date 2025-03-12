const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล student จากฐานข้อมูล
exports.fetchStudentData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM students"); // Query ข้อมูลจากตาราง students
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch student data");
    }
};

// Check ว่ามี PrefixsId บน Table prefixes หรือไม่?
exports.checkStudentPrefixsIdData = async (prefixes_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM prefixes WHERE id = ?", [prefixes_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check prefixes_id data");
    }
}

// Check ว่ามี NationalId บน Table students หรือไม่?
exports.checkStudentNationalIdData = async (national_id) => {
    try {
        const [rows] = await db.query("SELECT national_id FROM students WHERE national_id = ?", [national_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check national_id data");
    }
}

// Check ว่ามี GendersId บน Table genders หรือไม่?
exports.checkStudentGendersIdData = async (genders_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM genders WHERE id = ?", [genders_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check genders_id data");
    }
}

// Check ว่ามี Email บน Table students หรือไม่?
exports.checkStudentEmailData = async (email) => {
    try {
        const [rows] = await db.query("SELECT email FROM students WHERE email = ?", [email]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check email data");
    }
}

// Check ว่ามี EnrollmentYearsId บน Table enrollment_years หรือไม่?
exports.checkStudentEnrollmentYearsIdData = async (enrollment_years_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM enrollment_years WHERE id = ?", [enrollment_years_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check enrollment_years_id data");
    }
}

// Check ว่ามี SubDisctrictsId บน Table sub_districts หรือไม่?
exports.checkStudentSubDisctrictsIdData = async (subdistricts_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM sub_districts WHERE id = ?", [subdistricts_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check subdistricts_id data");
    }
}

// Check ว่ามี DisctrictsId บน Table districts หรือไม่?
exports.checkStudentDisctrictsIdData = async (districts_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE id = ?", [districts_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check districts_id data");
    }
}

// Check ว่ามี ProvincesId บน Table provinces หรือไม่?
exports.checkStudentProvincesIdData = async (provinces_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE id = ?", [provinces_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check provinces_id data");
    }
}

// Check ว่ามี LevelEducationId บน Table level_educations หรือไม่?
exports.checkStudentLevelEducationIdData = async (level_educations_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM level_educations WHERE id = ?", [level_educations_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check level_educations_id data");
    }
}

// Check ว่ามี GradeLevelId บน Table grade_levels หรือไม่?
exports.checkStudentGradeLevelIdData = async (grade_levels_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM grade_levels WHERE id = ?", [grade_levels_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check grade_levels_id data");
    }
}

// Check ว่ามี ProgramsId บน Table programs หรือไม่?
exports.checkStudentProgramsIdData = async (programs_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM programs WHERE id = ?", [programs_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check programs_id data");
    }
}

// Check ว่ามี checkStudentTeacherId บน Table teachers หรือไม่?
exports.checkStudentTeacherIdData = async (teachers_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM teachers WHERE id = ?", [teachers_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check teachers_id data");
    }
}

// Check ว่ามี StatusId บน Table student_status หรือไม่?
exports.checkStudentStatusIdData = async (student_status_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM student_status WHERE id = ?", [student_status_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check student_status_id data");
    }
}

// เพิ่มข้อมูลไปยัง Table students
exports.addStudentData = async (data) => {
    try {
        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            national_id,
            date_of_birth,
            phone_number,
            email,
            enrollment_years_id,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            level_educations_id,
            grade_levels_id,
            programs_id,
            teachers_id,
            image,
            student_status_id,
            created_by, 
            updated_by
        } = data;

        // จัดการแปลง Base64 ให้กลายเป็น Buffer Binary
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary

        const [result] = await db.query(
            `
                INSERT INTO students (
                    prefixes_id,
                    first_name,
                    last_name,
                    genders_id,
                    national_id,
                    date_of_birth,
                    phone_number,
                    email,
                    enrollment_years_id,
                    house_number,
                    village_group,
                    subdistricts_id,
                    districts_id,
                    provinces_id,
                    level_educations_id,
                    grade_levels_id,
                    programs_id,
                    teachers_id,
                    image,
                    student_status_id,
                    created_by, 
                    updated_by 
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                prefixes_id,
                first_name,
                last_name,
                genders_id,
                national_id,
                date_of_birth,
                phone_number,
                email,
                enrollment_years_id,
                house_number,
                village_group,
                subdistricts_id,
                districts_id,
                provinces_id,
                level_educations_id,
                grade_levels_id,
                programs_id,
                teachers_id,
                imageBuffer,
                student_status_id,
                created_by, 
                updated_by 
            ]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add student data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table students หรือไม่?
exports.checkIdStudentData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM students WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check id data");
    }
};

// อัพเดทข้อมูลไปยัง Table students
exports.updateStudentData = async (id, data) => {
    try {
        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            national_id,
            date_of_birth,
            phone_number,
            email,
            enrollment_years_id,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            level_educations_id,
            grade_levels_id,
            programs_id,
            teachers_id,
            image,
            student_status_id,
            updated_by
        } = data;

        // จัดการแปลง Base64 ให้กลายเป็น Buffer Binary
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary

        const [result] = await db.query(
            `
                UPDATE students 
                SET 
                    prefixes_id = ?,
                    first_name = ?,
                    last_name = ?,
                    genders_id = ?,
                    national_id = ?,
                    date_of_birth = ?,
                    phone_number = ?,
                    email = ?,
                    enrollment_years_id = ?,
                    house_number = ?,
                    village_group = ?,
                    subdistricts_id = ?,
                    districts_id = ?,
                    provinces_id = ?,
                    level_educations_id = ?,
                    grade_levels_id = ?,
                    programs_id = ?,
                    teachers_id = ?,
                    image = ?,
                    student_status_id = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [
                prefixes_id,
                first_name,
                last_name,
                genders_id,
                national_id,
                date_of_birth,
                phone_number,
                email,
                enrollment_years_id,
                house_number,
                village_group,
                subdistricts_id,
                districts_id,
                provinces_id,
                level_educations_id,
                grade_levels_id,
                programs_id,
                teachers_id,
                imageBuffer,
                student_status_id,
                updated_by,
                id
            ]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update student data");
    }
};

// ลบข้อมูลบน Table students
exports.removeStudentData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง students
        const [deleteResult] = await db.query('DELETE FROM students WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง students เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM students');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE students AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing student data:', err.message);
        throw new Error('Failed to remove student data');
    }
};