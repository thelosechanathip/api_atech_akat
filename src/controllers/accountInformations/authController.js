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

// Fetch User
exports.authGetAllDataUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        
        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (rows.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, rows);
    } catch (error) {
        console.error("Error authGetAllDataUsers:", error.message);
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
        if(checkAuthUsernameResult) return msg(res, 409, 'Username ซ้ำกรุณาตรวจสอบข้อมูล!!');

        // Check password strength (contains uppercase, lowercase, number, and special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) return msg(res, 400, 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 8 ตัวและมีอักขระพิเศษ ภาษาอังกฤษตัวพิมพ์เล็กและใหญ่ รวมทั้งตัวเลขด้วย!');

        const checkUserDataOnTableResult = await checkUserDataOnTable(username);
        if (!checkUserDataOnTableResult) return msg(res, 400, 'กรุณาเพิ่มข้อมูลประจำตัวก่อน!');

        const addAuthUserDataResult = await addAuthUserData(req.body);
        if(addAuthUserDataResult) return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
    }  catch (error) {
        console.error("Error register data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// Edit User
exports.updateDataUser = async (req, res) => {
    try {

    } catch (error) {
        console.error("Error updateDataUser:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// Login User
exports.authLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check ว่ามีการส่งข้อมูลมาหรือไม่?
        if(!username || !password) return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบ!');

        const checkAuthUsernameResult = await checkAuthUsername(username);
        if(!checkAuthUsernameResult) return msg(res, 400, 'ไม่พบ User นี้ในระบบกรุณาตรวจสอบข้อมูล!');

        const checkAuthPasswordResult = await checkAuthPassword(req.body);
        if(checkAuthPasswordResult != true) return msg(res, 400, 'รหัสผ่านไม่ถูกต้องกรุณาตรวจสอบรหัสผ่าน!');

        const checkAuthEnabledResult = await checkAuthEnabled(username);
        if(checkAuthEnabledResult[0].enabled != 1) return msg(res, 400, 'User นี้ไม่ได้ถูกเปิดให้ใช้งานหากต้องการใช้งานกรุณาติดต่อ Admin ของระบบ!');

        const getDataUserResult = await getDataUser(username);
        const userId = getDataUserResult[0].id;
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn: '1h'});

        if(token) {
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
        
        if(!decoded) return msg(res, 400, false);

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
        if(req.userId == checkUserIdOnRequestIdResult) return msg(res, 200, "ไม่สามารถ remove user ตัวเองได้!!");

        const checkUserIdResult = await checkUserId(requestId);
        if(!checkUserIdResult) return msg(res, 400, "ไม่มี User นี้ในระบบ กรุณาตรวจสอบ!!");

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
    if(authHeader) {
        try{
            const token = authHeader.split(' ')[1]; 
    
            if(token) {

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if(decoded) {
                    const data = {
                        token: token,
                        expires_at: decoded.exp
                    }

                    const addBlackListTokenResult = await addBlackListToken(data);
                    if(!addBlackListTokenResult) return msg(res, 400, "เกิดข้อผิดพลาดระหว่างการทำงานกรุณาติดต่อ Admin ของระบบ!");

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