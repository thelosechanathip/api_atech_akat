const {
    checkAuthUsername,
    checkUserDataOnTable,
    addAuthUserData,
    checkAuthPassword,
    checkAuthEnabled,
    getDataUser,
    fetchDataUserAll,
    checkUserIdOnRequestId,
    checkUserId,
    removeUser,
    addAuthToken,
    changeVerified,
    addBlackListToken
} = require('../../models/accountInformations/authModel');
const db = require('../../config/db');
const { msg } = require('../../utils/message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fetch User
exports.authGetAllDataUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        if (users.length === 0) return msg(res, 404, "No data found");

        const result = [];

        for (const user of users) {
            // ดึง role_id ของ user นี้
            const [userOnRoles] = await db.query(
                "SELECT role_id FROM user_on_roles WHERE user_id = ?",
                [user.id]
            );
            const roleIds = userOnRoles.map(r => r.role_id);

            let roleNames = [];
            if (roleIds.length > 0) {
                const placeholders = roleIds.map(() => '?').join(',');
                const [roles] = await db.query(
                    `SELECT role_name FROM roles WHERE id IN (${placeholders})`,
                    roleIds
                );
                roleNames = roles.map(r => r.role_name);
            }

            result.push({
                id: user.id,
                username: user.username,
                enables: user.enables,
                roles: roleNames,
                created_at: user.created_at,
                created_by: user.created_by,
                updated_at: user.updated_at,
                updated_by: user.updated_by
            });
        }

        return msg(res, 200, result);

    } catch (error) {
        console.error("Error authGetAllDataUsers:", error);
        return msg(res, 500, "Internal Server Error");
    }
};


// Register User
exports.authRegister = async (req, res) => {
    try {
        const { username, password, role, created_by, updated_by } = req.body;

        // Check ว่ามีการกรอกข้อมูลมาหรือไม่?
        if (!username || !password || !created_by || !updated_by) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน!');

        // Check ว่า username ซ้ำหรือไม่
        const checkAuthUsernameResult = await checkAuthUsername(username);
        if (checkAuthUsernameResult) return msg(res, 409, 'Username ซ้ำกรุณาตรวจสอบข้อมูล!!');

        // Check password strength (contains uppercase, lowercase, number, and special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) return msg(res, 400, 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 8 ตัวและมีอักขระพิเศษ ภาษาอังกฤษตัวพิมพ์เล็กและใหญ่ รวมทั้งตัวเลขด้วย!');

        const checkUserDataOnTableResult = await checkUserDataOnTable(username);
        if (!checkUserDataOnTableResult) return msg(res, 400, 'กรุณาเพิ่มข้อมูลประจำตัวก่อน!');

        const addAuthUserDataResult = await addAuthUserData(req.body);
        if (addAuthUserDataResult) return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
    } catch (error) {
        console.error("Error register data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// Edit User
exports.updateDataUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { password, enabled, role: roles } = req.body;

        // 1. ตรวจสอบความปลอดภัยของรหัสผ่าน
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) return msg( res, 400, 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 8 ตัวและมีอักขระพิเศษ ภาษาอังกฤษพิมพ์เล็ก-ใหญ่ รวมทั้งตัวเลข!' );

        // 2. hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // 3. update ข้อมูล user
        const [updateResult] = await db.query(
            `UPDATE users
           SET password = ?, enabled = ?, updated_by = ?
         WHERE id = ?`,
            [hashPassword, enabled, req.name, userId]
        );
        if (updateResult.affectedRows === 0) {
            return msg(res, 404, "User ไม่พบหรือไม่มีการเปลี่ยนแปลงข้อมูล");
        }

        // 4. ลบ role เดิม (ถ้ามี) แล้ว insert ใหม่ทั้งหมด
        // ลบข้อมูลจากตาราง user_on_roles
        const [deleteResult] = await db.query('DELETE FROM user_on_roles WHERE user_id = ?', [userId]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง user_on_roles เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM user_on_roles');
            const nextAutoIncrement_3 = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE user_on_roles AUTO_INCREMENT = ?', [nextAutoIncrement_3]);

            // 5. insert role ใหม่
            for (const r of roles) {
                await db.query(
                    `
                        INSERT INTO user_on_roles(user_id, role_id, created_by, updated_by)
                        VALUES(?, ?, ?, ?)
                    `,
                    [userId, r, req.name, req.name]
                );
            }
        }

        // 6. ตอบกลับเมื่อทำงานครบทุกขั้นตอน
        return msg(res, 200, "Update user successfully!");

    } catch (error) {
        console.error("Error updateDataUser:", error);
        return msg(res, 500, "Internal Server Error");
    }
};

// Login User
exports.authLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check ว่ามีการส่งข้อมูลมาหรือไม่?
        if (!username || !password) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบ!');

        const checkAuthUsernameResult = await checkAuthUsername(username);
        if (!checkAuthUsernameResult) return msg(res, 400, 'ไม่พบ User นี้ในระบบกรุณาตรวจสอบข้อมูล!');

        const checkAuthPasswordResult = await checkAuthPassword(req.body);
        if (checkAuthPasswordResult != true) return msg(res, 400, 'รหัสผ่านไม่ถูกต้องกรุณาตรวจสอบรหัสผ่าน!');

        const checkAuthEnabledResult = await checkAuthEnabled(username);
        if (checkAuthEnabledResult[0].enabled != 1) return msg(res, 400, 'User นี้ไม่ได้ถูกเปิดให้ใช้งานหากต้องการใช้งานกรุณาติดต่อ Admin ของระบบ!');

        const getDataUserResult = await getDataUser(username);
        const userId = getDataUserResult[0].id;
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (token) {
            try {
                await addAuthToken(token);
                return msg(res, 200, token);
            } catch (err) {
                console.error("Error token:", err.message);
                return msg(res, 500, { message: "Internal Server Error" });
            }
        }
    } catch (error) {
        console.error("Error login data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// Verify User
exports.authVerify = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return msg(res, 400, false);

    const token = authHeader.split(' ')[1];
    try {

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return msg(res, 400, false);

        const fetchDataUserAllResult = await fetchDataUserAll(decoded.userId);

        // await changeVerified(token);
        return msg(res, 200, {
            valid: true,
            user_info: fetchDataUserAllResult.detail
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return msg(res, 401, false);
        } else if (err.name === 'JsonWebTokenError') {
            return msg(res, 401, false);
        }
        console.error('Error verifying token:', err);
        return msg(res, 500, false);
    }
};

// Remove User
exports.authRemoveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requestId = parseInt(id);
        const checkUserIdOnRequestIdResult = await checkUserIdOnRequestId(requestId);
        if (req.userId == checkUserIdOnRequestIdResult) return msg(res, 400, "ไม่สามารถ remove user ตัวเองได้!!");

        const checkUserIdResult = await checkUserId(requestId);
        if (!checkUserIdResult) return msg(res, 404, "ไม่มี User นี้ในระบบ กรุณาตรวจสอบ!!");

        const removeUserResult = await removeUser(requestId);
        return msg(res, 200, "Remove successfully!");
    } catch (error) {
        console.error("Error remove data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// Logout User
exports.authLogout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];

            if (token) {

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded) {
                    const data = {
                        token: token,
                        expires_at: decoded.exp
                    }

                    const addBlackListTokenResult = await addBlackListToken(data);
                    if (!addBlackListTokenResult) return msg(res, 400, "เกิดข้อผิดพลาดระหว่างการทำงานกรุณาติดต่อ Admin ของระบบ!");

                    return msg(res, 200, 'Logout_Successfully!!');
                }
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return msg(res, 401, 'TokenExpiredError');
            } else if (err.name === 'JsonWebTokenError') {
                return msg(res, 401, 'JsonWebTokenError');
            }
            console.error("Error logout data:", err.message);
            return msg(res, 500, "Internal Server Error");
        }
    } else return msg(res, 400, "Logout Failed!!");
};