const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');

// Check Username บน Database => Table users
exports.checkAuthUsername = async (username) => {
    try {
        const [result] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        return result.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkAuthUsername");
    }
}

exports.checkUserDataOnTable = async (username) => {
    try {
        const result = { role: [], type: false };

        const [students] = await db.query('SELECT national_id FROM students WHERE national_id = ?', [username]);
        if (students.length > 0) {
            result.role.push('student');
            result.type = true;
        }

        const [teachers] = await db.query('SELECT national_id FROM teachers WHERE national_id = ?', [username]);
        if (teachers.length > 0) {
            result.role.push('teacher');
            result.type = true;
        }

        const [admins] = await db.query('SELECT national_id FROM admins WHERE national_id = ?', [username]);
        if (admins.length > 0) {
            result.role.push('admin');
            result.type = true;
        }

        return result.role.length > 0 ? result : false;

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkUserDataOnTable");
    }
};

// Add Data ไปยัง Database => Table users
exports.addAuthUserData = async (data) => {
    try {
        const { username, password, role, created_by, updated_by } = data;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const [addDataToUser] = await db.query(
            `
                INSERT INTO users (username, password, created_by, updated_by)
                VALUES(?, ?, ?, ?) 
            `,
            [username, hashPassword, created_by, updated_by]
        );
        
        if(addDataToUser.affectedRows > 0) {
            if(role.length > 0) {
                try {
                    const userOnRoles = [];
                    for (const r of role) {
                        const [addDataUserOnRole] = await db.query(
                            `
                                INSERT INTO user_on_roles(user_id, role_id, created_by, updated_by)
                                VALUES(?, ?, ?, ?)  
                            `,
                            [addDataToUser.insertId, r, created_by, updated_by]
                        );
                        userOnRoles.push(addDataUserOnRole);
                    }
                    const totalAffectedRows = userOnRoles.reduce((acc, curr) => acc + curr.affectedRows, 0);
                    return totalAffectedRows > 0;
                } catch (err) {
                    console.error(err.message);
                    throw new Error("Failed to add user on roles");
                }
            }
        }
        return false; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addAuthUserData");
    }
}

// /Check Password ของ username ที่ส่งเข้ามาว่าตรงกับข้อมูลบน Database => Table users หรือไม่?
exports.checkAuthPassword = async (data) => {
    try {
        const { username, password } = data;
        const [getDataUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        const isMath = await bcrypt.compare(password, getDataUsers[0].password);
        return isMath;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkAuthPassword");
    }
}

// Check Enabled ของ username บน Database => Table users
exports.checkAuthEnabled = async (username) => {
    try {
        const [result] = await db.query('SELECT enabled FROM users WHERE username = ?', [username]);
        return result;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkAuthEnabled");
    }
}

// Fetch User
exports.getDataUser = async (username) => {
    try {
        const [getDataUsers] = await db.query('SELECT id FROM users WHERE username = ?', [username]);

        return getDataUsers; // Return the payload
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to getDataUser");
    }
};

// fetch User All Data
exports.fetchDataUserAll = async (userId) => {
    try {
        // ดึง username ของผู้ใช้
        const [getDataUsers] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
        if (getDataUsers.length === 0) throw new Error("User not found");

        const nationalId = getDataUsers[0].username;

        // ดึง roles ของผู้ใช้
        const [getDataUserOnRoles] = await db.query('SELECT role_id FROM user_on_roles WHERE user_id = ?', [userId]);
        const getRoles = [];

        for (const role of getDataUserOnRoles) {
            const [getRolesResult] = await db.query('SELECT role_name FROM roles WHERE id = ?', [role.role_id]);
            getRoles.push(...getRolesResult);
        }

        if (getRoles.length === 0) {
            return { detail: [] }; // ถ้าไม่มี role ให้คืนค่าเป็น array ว่าง
        }

        // ค้นหาข้อมูลในตาราง students, teachers, admins ตามลำดับ
        let userInfo = [];

        const [checkStudentResult] = await db.query('SELECT first_name_thai, last_name_thai FROM students WHERE national_id = ?', [nationalId]);
        if (checkStudentResult.length > 0) {
            userInfo = checkStudentResult;
        } else {
            const [checkTeacherResult] = await db.query('SELECT first_name_thai, last_name_thai FROM teachers WHERE national_id = ?', [nationalId]);
            if (checkTeacherResult.length > 0) {
                userInfo = checkTeacherResult;
            } else {
                const [checkAdminResult] = await db.query('SELECT first_name_thai, last_name_thai FROM admins WHERE national_id = ?', [nationalId]);
                if (checkAdminResult.length > 0) {
                    userInfo = checkAdminResult;
                }
            }
        }

        // จัดรูปแบบข้อมูล
        return {
            detail: userInfo.map(user => ({
                ...user,
                role: getRoles.map(role => role.role_name) // เพิ่ม role เข้าไปใน object user
            }))[0]
        };

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchDataUserAll");
    }
};

// Check user id 
exports.checkUserIdOnRequestId = async (id) => {
    try {
        const [result] = await db.query('SELECT * FROM user_on_roles WHERE user_id = ?', [id]);
        const uniqueUserIds = [...new Set(result.map(i => i.user_id))];
        return uniqueUserIds;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkUserIdOnRequestId");
    }
}

// Check user id data
exports.checkUserId = async (id) => {
    try {
        const [result] = await db.query('SELECT * FROM user_on_roles WHERE user_id = ?', [id]);
        return result.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkUserId");
    }
}

// remove User Data
exports.removeUser = async (id) => {
    try {
        const [removeUserOnRoles] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [id]);
        if (removeUserOnRoles.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement]);
        }

        const [removeUser] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        if (removeUser.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM users');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement]);
            return true;
        }

        return false;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to removeUser");
    }
}

// Function สำหรับบันทึกข้อมูล Token ไปยัง Table auth_tokens
exports.addAuthToken = async (token) => {
    try {
        const dataToken = await jwt.verify(token, process.env.JWT_SECRET);
        const exp = moment.unix(dataToken.exp).format('YYYY-MM-DD HH:mm:ss');
        
        const sql_1 = `
            INSERT INTO auth_tokens(token, user_id, expires_at) VALUES(?, ?, ?)
        `;
        const [addAuthTokenResult] = await db.query(sql_1, [token, dataToken.userId, exp]);

        return addAuthTokenResult.affectedRows > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to addAuthToken");
    }
}

// Function สำหรับแก้ไขข้อมูล otp_verified ไปยัง Table auth_tokens
exports.changeVerified = async (token) => {
    try {
        const dataToken = await jwt.verify(token, process.env.JWT_SECRET);

        const sql_1 = `
            UPDATE auth_tokens
            SET
                otp_verified = ?
            WHERE token = ?
        `;
        const [updateOtpVerifiedResult] = await db.query(sql_1, [true, token]);
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to changeVerified");
    }
}

// Function ในการเพิ่มข้อมูล Token ไปยัง Table token_blacklist และอัพเดท field is_active ของ Table auth_tokens
exports.addBlackListToken = async (data, fullname) => {
    try {
        const sql_1 = 'INSERT INTO token_blacklist(token, expires_at) VALUES(?, ?)';
        const exp = moment.unix(data.expires_at).format('YYYY-MM-DD HH:mm:ss');
        const [addTokenBlackListResult] = await db.query(sql_1, [data.token, exp]);

        if (addTokenBlackListResult.affectedRows > 0) {
            // แก้ไข syntax ของ sql_2
            const sql_2 = `UPDATE auth_tokens SET is_active = ? WHERE token = ?`;
            const [updateAuthTokensResult] = await db.query(sql_2, [false, data.token]); // สลับลำดับ parameter ให้ตรงกับ query

            if (updateAuthTokensResult.affectedRows > 0) return true;
        }

        return false;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to addBlackListToken");
    }
};