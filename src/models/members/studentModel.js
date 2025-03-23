const db = require('../../config/db');
const moment = require('moment');
const bcrypt = require('bcryptjs');

function convertToThaiDateFormat(date_of_birth) {
    let birthDate = moment(date_of_birth, "YYYY-MM-DD");
    let day = birthDate.format("DD");
    let month = birthDate.format("MM");
    let buddhistYear = birthDate.year() + 543;

    return `${day}${month}${buddhistYear}`;
}

// ฟังก์ชันสำหรับดึงข้อมูล students จากฐานข้อมูล
exports.fetchStudentsData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM students"); // Query ข้อมูลจากตาราง students
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchStudentsData");
    }
};

// Check ว่ามี national_id(เลขบัตรประชาชน) ซ้ำในระบบหรือไม่?
exports.checkNationalIdData = async (national_id) => {
    try {
        const [result] = await db.query('SELECT national_id FROM students WHERE national_id = ?', [national_id]);
        return result.length > 0;
    } catch (err) {
        console.error('Error while checkNationalIdData:', err.message);
        throw new Error('Failed to checkNationalIdData');
    }
}

// Check ว่ามี email(Email) ซ้ำในระบบหรือไม่?
exports.checkEmailData = async (email) => {
    try {
        const [result] = await db.query('SELECT email FROM students WHERE email = ?', [email]);
        return result.length > 0;
    } catch (err) {
        console.error('Error while checkEmailData:', err.message);
        throw new Error('Failed to checkEmailData');
    }
}

// Check ว่ามี student_code(รหัสประจำตัวนักศึกษา) ซ้ำในระบบหรือไม่?
exports.checkStudentCodeData = async (student_code) => {
    try {
        const [result] = await db.query('SELECT student_code FROM students WHERE student_code = ?', [student_code]);
        return result.length > 0;
    } catch (err) {
        console.error('Error while checkStudentCodeData:', err.message);
        throw new Error('Failed to checkStudentCodeData');
    }
}

// Function สำหรับ register ข้อมูลบนระบบ students, users, user_on_roles ไปยังฐานข้อมูล
exports.insertStudentData = async (data, name) => {
    try {
        const {
            prefix_id,
            first_name_thai,
            last_name_thai,
            first_name_english,
            last_name_english,
            national_id,
            date_of_birth,
            gender_id,
            nationality_id,
            ethnicity_id,
            religion_id,
            phone_number,
            email,
            house_number,
            village_group,
            sub_district_id,
            district_id,
            province_id,
            student_code,
            enrollment_term_id,
            educational_institution_id,
            education_level_id,
            father_prefix_id,
            father_first_name_thai,
            father_last_name_thai,
            father_national_id,
            father_marital_status_id,
            father_occupation_id,
            father_nationality_id,
            father_phone_number,
            mother_prefix_id,
            mother_first_name_thai,
            mother_last_name_thai,
            mother_national_id,
            mother_marital_status_id,
            mother_occupation_id,
            mother_nationality_id,
            mother_phone_number,
            guardian_prefix_id,
            guardian_first_name_thai,
            guardian_last_name_thai,
            guardian_national_id,
            guardian_relation_to_student,
            guardian_phone_number,
            guardian_occupation_id,
            guardian_nationality_id,
            guardian_house_number,
            guardian_village_group,
            guardian_sub_district_id,
            guardian_district_id,
            guardian_province_id,
            image,
            student_status_id
        } = data;

        let dateNow = moment(); // เวลาปัจจุบัน
        let birthDate = moment(date_of_birth, "YYYY-MM-DD"); // แปลงวันเกิดเป็น moment object
        let enrollment_age = dateNow.diff(birthDate, 'years'); // คำนวณอายุเป็นปี
        let enrollment_date = moment().format("YYYY-MM-DD");
        let enrollment_year = moment().format("YYYY");

        // ✅ แปลง birthDate เป็น format "YYYY-MM-DD"
        let birthDateFormatted = birthDate.format("YYYY-MM-DD");

        // ✅ เพิ่มชื่อตาราง students ลงไปใน INSERT INTO
        const [insertStudentResult] = await db.query(
            `
                INSERT INTO students (
                    prefix_id,
                    first_name_thai,
                    last_name_thai,
                    first_name_english,
                    last_name_english,
                    national_id,
                    date_of_birth,
                    gender_id,
                    enrollment_age,
                    nationality_id,
                    ethnicity_id,
                    religion_id,
                    phone_number,
                    email,
                    house_number,
                    village_group,
                    sub_district_id,
                    district_id,
                    province_id,
                    student_code,
                    enrollment_date,
                    enrollment_year,
                    enrollment_term_id,
                    educational_institution_id,
                    education_level_id,
                    father_prefix_id,
                    father_first_name_thai,
                    father_last_name_thai,
                    father_national_id,
                    father_marital_status_id,
                    father_occupation_id,
                    father_nationality_id,
                    father_phone_number,
                    mother_prefix_id,
                    mother_first_name_thai,
                    mother_last_name_thai,
                    mother_national_id,
                    mother_marital_status_id,
                    mother_occupation_id,
                    mother_nationality_id,
                    mother_phone_number,
                    guardian_prefix_id,
                    guardian_first_name_thai,
                    guardian_last_name_thai,
                    guardian_national_id,
                    guardian_relation_to_student,
                    guardian_phone_number,
                    guardian_occupation_id,
                    guardian_nationality_id,
                    guardian_house_number,
                    guardian_village_group,
                    guardian_sub_district_id,
                    guardian_district_id,
                    guardian_province_id,
                    image,
                    student_status_id,
                    created_by,
                    updated_by
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            `,
            [
                prefix_id,
                first_name_thai,
                last_name_thai,
                first_name_english,
                last_name_english,
                national_id,
                birthDateFormatted,
                gender_id,
                enrollment_age,
                nationality_id,
                ethnicity_id,
                religion_id,
                phone_number,
                email,
                house_number,
                village_group,
                sub_district_id,
                district_id,
                province_id,
                student_code,
                enrollment_date,
                enrollment_year,
                enrollment_term_id,
                educational_institution_id,
                education_level_id,
                father_prefix_id,
                father_first_name_thai,
                father_last_name_thai,
                father_national_id,
                father_marital_status_id,
                father_occupation_id,
                father_nationality_id,
                father_phone_number,
                mother_prefix_id,
                mother_first_name_thai,
                mother_last_name_thai,
                mother_national_id,
                mother_marital_status_id,
                mother_occupation_id,
                mother_nationality_id,
                mother_phone_number,
                guardian_prefix_id,
                guardian_first_name_thai,
                guardian_last_name_thai,
                guardian_national_id,
                guardian_relation_to_student,
                guardian_phone_number,
                guardian_occupation_id,
                guardian_nationality_id,
                guardian_house_number,
                guardian_village_group,
                guardian_sub_district_id,
                guardian_district_id,
                guardian_province_id,
                image,
                student_status_id,
                name,
                name
            ]
        );
        

        let thaiDate = convertToThaiDateFormat(date_of_birth);

        if(insertStudentResult.affectedRows > 0) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(thaiDate, salt);
            const [insertUserResult] = await db.query(
                `
                    INSERT INTO users (
                        username,
                        password,
                        created_by,
                        updated_by
                    ) VALUES (
                        ?, ?, ?, ? 
                    )
                `,
                [
                    national_id, hashPassword, name, name
                ]
            );

            // ตรวจสอบว่ามีผลลัพธ์จากการคิวรีก่อนที่จะเข้าถึง id
            if(insertUserResult.affectedRows > 0) {
                const [fetchOneRoleDataResult] = await db.query('SELECT id, role_name FROM roles WHERE role_name = ?', ['student']);
                
                if (fetchOneRoleDataResult.length > 0) {
                    const [insertUserOnRoleResult] = await db.query(
                        `
                            INSERT INTO user_on_roles(
                                user_id,
                                role_id,
                                created_by,
                                updated_by
                            ) VALUES (
                                ?, ?, ?, ? 
                            )
                        `,
                        [insertUserResult.insertId, fetchOneRoleDataResult[0].id, name, name]
                    )
                    return insertUserOnRoleResult.affectedRows > 0;
                } else {
                    console.error("Role data not found.");
                }
            } else {
                console.error("User insert failed or id not found.");
            }
        }
    } catch (err) {
        console.error("Error inserting student data:", err.message);
        throw new Error("Failed to insert student");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table students หรือไม่?
exports.checkIdStudentData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM students WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdStudentData");
    }
};

// Check ว่ามี ID ที่ส่งเข้ามาตรงกับ ID ที่ Login อยู่หรือไม่?
exports.checkIdInLoginData = async (requestId, userId) => {
    try {
        const [fetchOneStudentNationalIdDataResult] = await db.query('SELECT national_id FROM students WHERE id = ?', [requestId]);
        const [fetchOneUserIdDataResult] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);

        return fetchOneStudentNationalIdDataResult[0].national_id === fetchOneUserIdDataResult[0].username;
    } catch (err) {
        console.error('Error while checkIdInLogin:', err.message);
        throw new Error('Failed to checkIdInLogin');
    }
}

// ลบข้อมูลบน Table students
exports.removeStudentData = async (id) => {
    try {
        const [fetchOneStudentNationalIdDataResult] = await db.query('SELECT national_id FROM students WHERE id = ?', [id]);
        const [fetchOneUserIdDataResult] = await db.query('SELECT id FROM users WHERE username = ?', [fetchOneStudentNationalIdDataResult[0].national_id]);

        // ลบข้อมูลจากตาราง user_on_roles
        const [deleteResult_1] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [fetchOneUserIdDataResult[0].id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_1.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult_1] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
            const nextAutoIncrement_1 = (maxIdResult_1[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement_1]);

            // ลบข้อมูลจากตาราง users
            const [deleteResult_2] = await db.query('DELETE FROM users WHERE id = ?', [fetchOneUserIdDataResult[0].id]);

            // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
            if (deleteResult_2.affectedRows > 0) {
                // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                const [maxIdResult_2] = await db.query('SELECT MAX(id) AS maxId FROM users');
                const nextAutoIncrement_2 = (maxIdResult_2[0].maxId || 0) + 1;

                // รีเซ็ตค่า AUTO_INCREMENT
                await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement_2]);

                // ลบข้อมูลจากตาราง students
                const [deleteResult_3] = await db.query('DELETE FROM students WHERE id = ?', [id]);

                // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                if (deleteResult_3.affectedRows > 0) {
                    // หาค่า MAX(id) จากตาราง students เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                    const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM students');
                    const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

                    // รีเซ็ตค่า AUTO_INCREMENT
                    await db.query('ALTER TABLE students AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

                    return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
                }
            }
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removeStudentData:', err.message);
        throw new Error('Failed to removeStudentData');
    }
};