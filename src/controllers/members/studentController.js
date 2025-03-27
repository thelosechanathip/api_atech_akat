const moment = require('moment');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { msg } = require('../../utils/message');
const { convertToThaiDateFormat } = require('../../utils/checkAll');

// ใช้สำหรับดึงข้อมูล Student (ข้อมูลนักศึกษา)
exports.getAllDataStudents = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAllDataStudents data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล Student( ข้อมูลนักศึกษา )
exports.registerDataStudent = async (req, res) => {
    try {
        const studentData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;
        let thaiDate = null;

        // เพิ่มค่าที่ต้องการลง studentData
        studentData.enrollment_date = moment().format("YYYY-MM-DD");
        studentData.enrollment_year = moment().format("YYYY");
        studentData.created_by = req.name;
        studentData.updated_by = req.name;

        // Loop ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(studentData).map(async ([key, value]) => {
                // ตรวจสอบค่าซ้ำเฉพาะฟิลด์สำคัญ
                if (["national_id", "email", "student_code"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT * FROM students WHERE ${key} = ? LIMIT 1`, [value]);
                    if (rows.length > 0) duplicateMessages.push(`( ${value} ) มีข้อมูลในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!`);
                }

                // คำนวณอายุจากวันเกิด
                if (key === "date_of_birth" && value) {
                    let birthDate = moment(value, "YYYY-MM-DD");
                    enrollment_age = moment().diff(birthDate, "years");
                    thaiDate = await convertToThaiDateFormat(value);
                }
            })
        );

        // ถ้ามีข้อมูลซ้ำ ให้แจ้งเตือน
        if (duplicateMessages.length > 0) return msg(res, 409, { message: duplicateMessages.join(" AND ") });

        // เพิ่มค่าอายุเข้าไปใน studentData
        studentData.enrollment_age = enrollment_age;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(studentData).join(", ");
        const values = Object.values(studentData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO students (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล students
        const [insertStudentResult] = await db.query(sql, values);
        if(insertStudentResult.affectedRows > 0) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(thaiDate, salt);
            const [insertUserResult] = await db.query(
                `
                    INSERT INTO users (username, password, created_by, updated_by) VALUES
                    ( ?, ?, ?, ? )
                `,[studentData.national_id, hashPassword, studentData.created_by, studentData.updated_by]
            );
            if(insertUserResult.affectedRows > 0) {
                const [fetchOneRoleDataResult] = await db.query('SELECT id FROM roles WHERE role_name = ?', ['student']);
                if(fetchOneRoleDataResult.length > 0) {
                    const [insertUserOnRoleResult] = await db.query(
                        `
                            INSERT INTO user_on_roles(user_id, role_id, created_by, updated_by) VALUES
                            (?, ?, ?, ?)
                        `,
                        [insertUserResult.insertId, fetchOneRoleDataResult[0].id, studentData.created_by, studentData.updated_by]
                    );
                    if(insertUserOnRoleResult.affectedRows > 0) {
                        return msg(res, 200, "Register student successfully!");
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error registerStudentData data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับอัพเดทข้อมูล Student( ข้อมูลนักศึกษา )
exports.updateDataStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;

        // อัปเดตข้อมูลพื้นฐาน
        studentData.updated_by = req.name;
        studentData.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneStudentIdResult] = await db.query('SELECT id FROM students WHERE id = ?', [studentId]);
        if (fetchOneStudentIdResult.length === 0) return msg(res, 404, 'ไม่มีข้อมูลนักศึกษา!');

        // ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(studentData).map(async ([key, value]) => {
                if (["national_id", "email", "student_code"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT id FROM students WHERE ${key} = ? LIMIT 1`, [value]);
                    if (rows.length > 0) duplicateMessages.push(`( ${value} ) มีข้อมูลในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!`);
                }

                // คำนวณอายุจากวันเกิด
                if (key === "date_of_birth" && value) {
                    let birthDate = moment(value, "YYYY-MM-DD");
                    enrollment_age = moment().diff(birthDate, "years");
                }
            })
        );

        if (duplicateMessages.length > 0) return msg(res, 409, { message: duplicateMessages.join(" AND ") });

        // เพิ่มค่าอายุเข้าไปใน studentData
        studentData.enrollment_age = enrollment_age;

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(studentData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(studentData), studentId];

        const sql = `UPDATE students SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedStudentResult] = await db.query(sql, values);

        if (updatedStudentResult.affectedRows > 0) return msg(res, 200, "Update student successfully!");
    } catch (error) {
        console.error("Error updateDataStudent data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล Student( ข้อมูลนักศึกษา )
exports.removeDataStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdStudentDataResult] = await db.query(`SELECT id, national_id FROM students WHERE id = ?`, [studentId]);
        if (checkIdStudentDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${studentId} ) อยู่ในระบบ!`);

        const [fetchOneStudentNationalIdDataResult] = await db.query('SELECT national_id FROM students WHERE id = ?', [studentId]);
        const [fetchOneUserIdDataResult] = await db.query('SELECT username FROM users WHERE id = ?', [req.userId]);
        if (fetchOneStudentNationalIdDataResult[0].national_id === fetchOneUserIdDataResult[0].username) return msg(res, 400, 'ไม่สามารถลบข้อมูลตัวเองได้!');

        if(checkIdStudentDataResult.length > 0) {
            const [fetchOneUserStudentIdDataResult] = await db.query('SELECT id FROM users WHERE username = ?', [checkIdStudentDataResult[0].national_id]);
            const [deleteResult_1] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [fetchOneUserStudentIdDataResult[0].id]);
            if (deleteResult_1.affectedRows > 0) {
                // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                const [maxIdResult_1] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
                const nextAutoIncrement_1 = (maxIdResult_1[0].maxId || 0) + 1;

                // รีเซ็ตค่า AUTO_INCREMENT
                await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement_1]);

                // ลบข้อมูลจากตาราง users
                const [deleteResult_2] = await db.query('DELETE FROM users WHERE id = ?', [fetchOneUserStudentIdDataResult[0].id]);

                // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                if (deleteResult_2.affectedRows > 0) {
                    // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                    const [maxIdResult_2] = await db.query('SELECT MAX(id) AS maxId FROM users');
                    const nextAutoIncrement_2 = (maxIdResult_2[0].maxId || 0) + 1;

                    // รีเซ็ตค่า AUTO_INCREMENT
                    await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement_2]);

                    // ลบข้อมูลจากตาราง students
                    const [deleteResult_3] = await db.query('DELETE FROM students WHERE id = ?', [studentId]);

                    // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                    if (deleteResult_3.affectedRows > 0) {
                        // หาค่า MAX(id) จากตาราง students เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                        const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM students');
                        const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

                        // รีเซ็ตค่า AUTO_INCREMENT
                        await db.query('ALTER TABLE students AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

                        return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
                    }
                }
            }
        }
    } catch(error) {
        console.error("Error removeDataStudent data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
}