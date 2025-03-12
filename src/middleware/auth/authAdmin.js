const CryptoJS = require("crypto-js");
const { msg } = require('../../utils/message');

exports.authAdmin = async (req, res, next) => {
    try {
        // ตรวจสอบว่ามี text ใน params หรือไม่
        const text = req.params.text;
        if (!text) {
            return msg(res, 400, { message: "กรุณาป้อนรหัสผ่าน" });
        }

        // ถอดรหัส text
        const bytes = CryptoJS.AES.decrypt(text, process.env.SECRET_KEY_ADMIN);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        // ตรวจสอบว่าถอดรหัสสำเร็จและมีข้อมูลหรือไม่
        if (!decryptedText) {
            return msg(res, 401, { message: "คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้" });
        }

        next();

    } catch (err) {
        console.error(err.message);
        return msg(res, 401, { message: "การยืนยันตัวตนล้มเหลว กรุณาตรวจสอบข้อมูลที่เข้ารหัส" });
    }
};