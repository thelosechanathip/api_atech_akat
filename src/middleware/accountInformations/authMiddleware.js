const db = require('../../config/db');
const { msg } = require('../../utils/message');
const jwt = require('jsonwebtoken');

// Check Token ของสิทธิ์ทั่วไป
exports.authCheckToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return msg(res, 500, { message: 'กรุณากรอก Token!' });

    const token = authHeader.split(' ')[1];
    try {
        const [checkBlackListToken] = await db.query('SELECT token FROM token_blacklist WHERE token = ?', [token]);
        if(checkBlackListToken.length > 0) return msg(res, 400, { message: 'Tokenไม่อนุญาติให้ใช้งาน!' });

        const [checkOtpVerified] = await db.query('SELECT otp_verified, is_active FROM auth_tokens WHERE token = ?', [token]);
        if(checkOtpVerified.length === 0) return msg(res, 400, { message: 'ไม่มีการ Login กรุณา Login!' });
        if(checkOtpVerified[0].otp_verified === 0) return msg(res, 401, { message: 'ไม่มีการยืนยันตัวตนกรุณายืนยันตัวตนก่อนใช้งานระบบ!' });
        if(checkOtpVerified[0].is_active === 0) return msg(res, 400, { message: 'Tokenไม่อนุญาติให้ใช้งาน!' });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) return msg(res, 401, { message: 'Token ไม่ถูกต้อง!' });

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return msg(res, 401, { message: 'TokenExpiredError!' });
        } else if (err.name === 'JsonWebTokenError') {
            return msg(res, 401, { message: 'JsonWebTokenError!' });
        }
        console.error('Error verifying token:', err);
        return msg(res, 500, 'Internal Server Error');
    }
};

// Check Token ของสิทธิ์ Admin
exports.authCheckAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return msg(res, 500, { message: 'กรุณากรอก Token!' });

    const token = authHeader.split(' ')[1];
    try {
        const [checkBlackListToken] = await db.query('SELECT token FROM token_blacklist WHERE token = ?', [token]);
        if(checkBlackListToken.length > 0) return msg(res, 400, { message: 'Tokenไม่อนุญาติให้ใช้งาน!' });

        const [checkOtpVerified] = await db.query('SELECT otp_verified, is_active FROM auth_tokens WHERE token = ?', [token]);
        if(checkOtpVerified.length === 0) return msg(res, 400, { message: 'ไม่มีการ Login กรุณา Login!' });
        if(checkOtpVerified[0].otp_verified === 0) return msg(res, 401, { message: 'ไม่มีการยืนยันตัวตนด้วย OTP กรุณายืนยันตัวตนก่อนใช้งานระบบ!' });
        if(checkOtpVerified[0].is_active === 0) return msg(res, 400, { message: 'Tokenไม่อนุญาติให้ใช้งาน!' });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return msg(res, 401, { message: 'Token ไม่ถูกต้อง!' });

        req.userId = decoded.userId;

        const [getRoleData] = await db.query(
            `
                SELECT * FROM user_on_roles WHERE user_id = ?
            `,
            [decoded.userId]
        );

        const roleIds = getRoleData.map(i => i.role_id);

        let hasRole1 = false;
        roleIds.forEach(id => {
            if (id === 1 || id === 4) hasRole1 = true;
        });

        if (!hasRole1) return msg(res, 401, { message: 'Token นี้ไม่มีสิทธิ์การใช้งาน!' });

        const check = { checkType: false, data:[] };

        const [fetchDataUserNationalId] = await db.query('SELECT username FROM users WHERE id = ?', [decoded.userId]);

        const [checkStudent] = await db.query('SELECT first_name_thai FROM students WHERE national_id = ?', [fetchDataUserNationalId[0].username]);
        if(checkStudent.length > 0 ) {
            check.checkType = true;
            check.data = checkStudent[0].first_name_thai;
        }

        const [checkAdmin] = await db.query('SELECT first_name_thai FROM admins WHERE national_id = ?', [fetchDataUserNationalId[0].username]);
        if(checkAdmin.length > 0 ) {
            check.checkType = true;
            check.data = checkAdmin[0].first_name_thai;
        }

        const [checkTeacher] = await db.query('SELECT first_name_thai FROM teachers WHERE national_id = ?', [fetchDataUserNationalId[0].username]);
        if(checkTeacher.length > 0 ) {
            check.checkType = true;
            check.data = checkTeacher[0].first_name_thai;
        }

        req.name = check.data;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return msg(res, 401, { message: 'TokenExpiredError!' });
        } else if (err.name === 'JsonWebTokenError') {
            return msg(res, 401, { message: 'JsonWebTokenError!' });
        }
        console.error('Error verifying token:', err);
        return msg(res, 500, 'Internal Server Error');
    }
};