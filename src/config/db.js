const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,      // อ่านค่าจาก .env
    user: process.env.DB_USER,      // อ่านค่าจาก .env
    password: process.env.DB_PASSWORD, // อ่านค่าจาก .env
    database: process.env.DB_NAME,  // อ่านค่าจาก .env
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

// ส่งออก pool เพื่อให้สามารถใช้งานได้ในไฟล์อื่น
module.exports = pool.promise(); // ใช้ promise() เพื่อรองรับ async/await