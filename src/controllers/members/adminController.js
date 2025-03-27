const moment = require('moment');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { msg } = require('../../utils/message');
const { convertToThaiDateFormat } = require('../../utils/checkAll');

// ใช้สำหรับดึงข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.getAllDataAdmin = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM admins");

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error fetching admin data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.addDataAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;
        let thaiDate = null;

        // เพิ่มค่าที่ต้องการลง adminData
        adminData.created_by = req.name;
        adminData.updated_by = req.name;

        // Loop ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(adminData).map(async ([key, value]) => {
                // ตรวจสอบค่าซ้ำเฉพาะฟิลด์สำคัญ
                if (["national_id", "email"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT * FROM admins WHERE ${key} = ? LIMIT 1`, [value]);
                    if (rows.length > 0) duplicateMessages.push(`( ${value} ) มีข้อมูลในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!`);
                }

                // คำนวณอายุจากวันเกิด
                if (key === "date_of_birth" && value) {
                    thaiDate = await convertToThaiDateFormat(value);
                }
            })
        );

        // ถ้ามีข้อมูลซ้ำ ให้แจ้งเตือน
        if (duplicateMessages.length > 0) return msg(res, 409, { message: duplicateMessages.join(" AND ") });

        // สร้าง Dynamic Query เพื่อบันทึกข้อมูลทั้งหมด
        const fields = Object.keys(adminData).join(", ");
        const values = Object.values(adminData);
        const placeholders = values.map(() => "?").join(", ");

        const sql = `INSERT INTO admins (${fields}) VALUES (${placeholders})`;

        // บันทึกข้อมูลลงฐานข้อมูล admins
        const [insertAdminResult] = await db.query(sql, values);
        if(insertAdminResult.affectedRows > 0) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(thaiDate, salt);
            const [insertUserResult] = await db.query(
                `
                    INSERT INTO users (username, password, created_by, updated_by) VALUES
                    ( ?, ?, ?, ? )
                `,[adminData.national_id, hashPassword, adminData.created_by, adminData.updated_by]
            );
            if(insertUserResult.affectedRows > 0) {
                const [fetchOneRoleDataResult] = await db.query('SELECT id FROM roles WHERE role_name = ?', ['admin']);
                if(fetchOneRoleDataResult.length > 0) {
                    const [insertUserOnRoleResult] = await db.query(
                        `
                            INSERT INTO user_on_roles(user_id, role_id, created_by, updated_by) VALUES
                            (?, ?, ?, ?)
                        `,
                        [insertUserResult.insertId, fetchOneRoleDataResult[0].id, adminData.created_by, adminData.updated_by]
                    );
                    if(insertUserOnRoleResult.affectedRows > 0) {
                        return msg(res, 200, "Register admin successfully!");
                    }
                }
            }
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Admin (ข้อมูลผู้ดูแลระบบ)
exports.updateDataAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const adminData = req.body;
        const duplicateMessages = [];
        let enrollment_age = null;

        // อัปเดตข้อมูลพื้นฐาน
        adminData.updated_by = req.name;
        adminData.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

        // เช็คว่ามีนักศึกษานี้ในฐานข้อมูลหรือไม่
        const [fetchOneAdminIdResult] = await db.query('SELECT id FROM admins WHERE id = ?', [adminId]);
        if (fetchOneAdminIdResult.length === 0) return msg(res, 404, 'ไม่มีข้อมูลนักศึกษา!');

        // ตรวจสอบข้อมูลซ้ำ
        await Promise.all(
            Object.entries(adminData).map(async ([key, value]) => {
                if (["national_id", "email"].includes(key) && value) {
                    const [rows] = await db.query(`SELECT id FROM admins WHERE ${key} = ? LIMIT 1`, [value]);
                    if (rows.length > 0) duplicateMessages.push(`( ${value} ) มีข้อมูลในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!`);
                }
            })
        );

        if (duplicateMessages.length > 0) return msg(res, 409, { message: duplicateMessages.join(" AND ") });

        // สร้าง SQL Query แบบ Dynamic
        const fields = Object.keys(adminData).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(adminData), adminId];

        const sql = `UPDATE admins SET ${fields} WHERE id = ?`;

        // อัปเดตข้อมูลนักศึกษา
        const [updatedAdminResult] = await db.query(sql, values);

        if (updatedAdminResult.affectedRows > 0) return msg(res, 200, "Update admin successfully!");
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Admin( ข้อมูลผู้ดูแลระบบ )
exports.removeDataAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const [checkIdAdminDataResult] = await db.query(`SELECT id, national_id FROM admins WHERE id = ?`, [adminId]);
        if (checkIdAdminDataResult.length === 0) return msg(res, 404, `ไม่มี ( ${adminId} ) อยู่ในระบบ!`);

        const [fetchOneAdminNationalIdDataResult] = await db.query('SELECT national_id FROM admins WHERE id = ?', [adminId]);
        const [fetchOneUserIdDataResult] = await db.query('SELECT username FROM users WHERE id = ?', [req.userId]);
        if (fetchOneAdminNationalIdDataResult[0].national_id === fetchOneUserIdDataResult[0].username) return msg(res, 400, 'ไม่สามารถลบข้อมูลตัวเองได้!');

        if(checkIdAdminDataResult.length > 0) {
            const [fetchOneUserAdminIdDataResult] = await db.query('SELECT id FROM users WHERE username = ?', [checkIdAdminDataResult[0].national_id]);
            const [deleteResult_1] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [fetchOneUserAdminIdDataResult[0].id]);
            if (deleteResult_1.affectedRows > 0) {
                // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                const [maxIdResult_1] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
                const nextAutoIncrement_1 = (maxIdResult_1[0].maxId || 0) + 1;

                // รีเซ็ตค่า AUTO_INCREMENT
                await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement_1]);

                // ลบข้อมูลจากตาราง users
                const [deleteResult_2] = await db.query('DELETE FROM users WHERE id = ?', [fetchOneUserAdminIdDataResult[0].id]);

                // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                if (deleteResult_2.affectedRows > 0) {
                    // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                    const [maxIdResult_2] = await db.query('SELECT MAX(id) AS maxId FROM users');
                    const nextAutoIncrement_2 = (maxIdResult_2[0].maxId || 0) + 1;

                    // รีเซ็ตค่า AUTO_INCREMENT
                    await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement_2]);

                    // ลบข้อมูลจากตาราง admins
                    const [deleteResult_3] = await db.query('DELETE FROM admins WHERE id = ?', [adminId]);

                    // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
                    if (deleteResult_3.affectedRows > 0) {
                        // หาค่า MAX(id) จากตาราง admins เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
                        const [maxIdResult_3] = await db.query('SELECT MAX(id) AS maxId FROM admins');
                        const nextAutoIncrement_3 = (maxIdResult_3[0].maxId || 0) + 1;

                        // รีเซ็ตค่า AUTO_INCREMENT
                        await db.query('ALTER TABLE admins AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

                        return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
                    }
                }
            }
        }
    } catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}