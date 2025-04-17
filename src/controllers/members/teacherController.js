const moment = require('moment');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { msg } = require('../../utils/message');
const { convertToThaiDateFormat } = require('../../utils/checkAll');

// ใช้สำหรับดึงข้อมูล Teacher (ข้อมูลอาจารย์)
exports.getAllDataTeachers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM teachers");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error getAllDataTeachers data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับบันทึกข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.registerDataTeacher = async (req, res) => {
    try {
        const teacherData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;
        let thaiDate = null;

        // เพิ่มค่าที่ต้องการลง teacherData
        teacherData.created_by = req.name;
        teacherData.updated_by = req.name;

        // Loop ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(teacherData).map(async ([key, value]) => {
                // ตรวจสอบค่าซ้ำเฉพาะฟิลด์สำคัญ
                if (["national_id", "email"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT * FROM teachers WHERE ${key} = ? LIMIT 1`, [value]);
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

        // เพิ่มค่าอายุเข้าไปใน teacherData
        teacherData.enrollment_age = enrollment_age;

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(teacherData).join(", ");
        const values = Object.values(teacherData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO teachers (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล teachers
        const [insertTeacherResult] = await db.query(sql, values);
        if(insertTeacherResult.affectedRows > 0) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(thaiDate, salt);
            const [insertUserResult] = await db.query(
                `
                    INSERT INTO users (username, password, created_by, updated_by) VALUES
                    ( ?, ?, ?, ? )
                `,[teacherData.national_id, hashPassword, teacherData.created_by, teacherData.updated_by]
            );
            if(insertUserResult.affectedRows > 0) {
                const [fetchOneRoleDataResult] = await db.query('SELECT id FROM roles WHERE role_name = ?', ['teacher']);
                if(fetchOneRoleDataResult.length > 0) {
                    const [insertUserOnRoleResult] = await db.query(
                        `
                            INSERT INTO user_on_roles(user_id, role_id, created_by, updated_by) VALUES
                            (?, ?, ?, ?)
                        `,
                        [insertUserResult.insertId, fetchOneRoleDataResult[0].id, teacherData.created_by, teacherData.updated_by]
                    );
                    if(insertUserOnRoleResult.affectedRows > 0) {
                        return msg(res, 200, "Register teacher successfully!");
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error registerTeacherData data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับอัพเดทข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.updateDataTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacherData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;

        // อัปเดตข้อมูลพื้นฐาน
        teacherData.updated_by = req.name;
        teacherData.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneTeacherIdResult] = await db.query('SELECT id FROM teachers WHERE id = ?', [teacherId]);
        if (fetchOneTeacherIdResult.length === 0) return msg(res, 404, 'ไม่มีข้อมูลนักศึกษา!');

        // ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(teacherData).map(async ([key, value]) => {
                if (["national_id", "email"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT id FROM teachers WHERE ${key} = ? LIMIT 1`, [value]);
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

        // เพิ่มค่าอายุเข้าไปใน teacherData
        teacherData.enrollment_age = enrollment_age;

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(teacherData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(teacherData), teacherId];

        const sql = `UPDATE teachers SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedTeacherResult] = await db.query(sql, values);

        if (updatedTeacherResult.affectedRows > 0) return msg(res, 200, "Update teacher successfully!");
    } catch (error) {
        console.error("Error updateDataTeacher data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับลบข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.removeDataTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdTeacherDataResult] = await db.query(`SELECT id, national_id FROM teachers WHERE id = ?`, [teacherId]);
        if (checkIdTeacherDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${teacherId} ) อยู่ในระบบ!`);

        const [fetchOneTeacherNationalIdDataResult] = await db.query('SELECT national_id FROM teachers WHERE id = ?', [teacherId]);
        const [fetchOneUserIdDataResult] = await db.query('SELECT username FROM users WHERE id = ?', [req.userId]);
        if (fetchOneTeacherNationalIdDataResult[0].national_id === fetchOneUserIdDataResult[0].username) return msg(res, 400, 'ไม่สามารถลบข้อมูลตัวเองได้!');

        if(checkIdTeacherDataResult.length > 0) {
            const [fetchOneUserTeacherIdDataResult] = await db.query('SELECT id FROM users WHERE username = ?', [checkIdTeacherDataResult[0].national_id]);
            const [deleteResult_1] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [fetchOneUserTeacherIdDataResult[0].id]);
            if (deleteResult_1.affectedRows > 0) {
                // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                const [maxIdResult_1] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
                const nextAutoIncrement_1 = (maxIdResult_1[0].maxId || 0) + 1;

                // รีเซ็ตค่า AUTO_INCREMENT
                await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement_1]);

                // ลบข้อมูลจากตาราง users
                const [deleteResult_2] = await db.query('DELETE FROM users WHERE id = ?', [fetchOneUserTeacherIdDataResult[0].id]);

                // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                if (deleteResult_2.affectedRows > 0) {
                    // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                    const [maxIdResult_2] = await db.query('SELECT MAX(id) AS maxId FROM users');
                    const nextAutoIncrement_2 = (maxIdResult_2[0].maxId || 0) + 1;

                    // รีเซ็ตค่า AUTO_INCREMENT
                    await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement_2]);

                    // ลบข้อมูลจากตาราง teachers
                    const [deleteResult_3] = await db.query('DELETE FROM teachers WHERE id = ?', [teacherId]);

                    // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                    if (deleteResult_3.affectedRows > 0) {
                        // หาค่า MAX(id) จากตาราง teachers เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                        const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM teachers');
                        const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

                        // รีเซ็ตค่า AUTO_INCREMENT
                        await db.query('ALTER TABLE teachers AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

                        return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
                    }
                }
            }
        }
    } catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
};