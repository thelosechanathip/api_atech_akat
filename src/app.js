const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const schedule = require('node-schedule');
const moment = require('moment');
const fs = require("fs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const db = require('./config/db');
const { authAdmin } = require('../src/middleware/auth/authAdmin');

const app = express();

// Middleware
app.use(morgan("dev")); // ใช้แสดงข้อมูลของ API ว่ามีการวิ่งของข้อมูลอะไรบ้าง
app.use(express.json()); // ทำให้สามารถอ่านข้อมูลไฟล์ JSON ได้

// CORS Configuration
const corsOptions = {
  origin: '*', // เว็บไซต์ที่อนุญาตให้เข้าถึง API http://atec-inter.ac.th
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // HTTP Methods ที่อนุญาต
  allowedHeaders: ["Content-Type", "Authorization"], // Headers ที่อนุญาต
  credentials: true, // อนุญาตให้ส่ง Cookies หรือ Credentials
};

app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: "http://localhost:5173", // หรือพอร์ตของ Frontend
//     credentials: true, // ถ้ามีการใช้ Cookies หรือ Authentication
//   })
// );

// โหลด apiReference แบบ dynamic import
app.get('/avenger/spiderman/ironmane/hulk/thor/cap/:text', authAdmin, async (req, res, next) => {
  const { apiReference } = await import('@scalar/express-api-reference');
  apiReference({
    theme: 'deepSpace',
    spec: {
      url: '/api/docs/swagger/U2FsdGVkX19XFdJBaJCb9prEw1DyIyDPu6dm%2FJXM7ZkkRXSPKkM9%2BKjarzGZd74s',
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })(req, res, next);
});

app.get('/api/docs/swagger/:text', authAdmin, async(req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

// Router
const routesPath = path.join(__dirname, "routes"); // กำหนดเส้นทางไปยังโฟลเดอร์ routes

if (fs.existsSync(routesPath)) {
    readdirSync(routesPath).map((routeFile) => {
        app.use('/apiv2', require(`${routesPath}/${routeFile}`));
    });
} else {
  console.error(`Routes folder not found at path: ${routesPath}`);
}

// Function ในการตรวจสอบ expires_at บน Table token_blacklist
async function checkBlackListTokensExpired() {
  try {
    const [fetchAllBlackListTokensResult] = await db.query('SELECT token, expires_at FROM token_blacklist');
    if (fetchAllBlackListTokensResult.length === 0) {
      console.log('BlackListTokenErrors : No tokens found in database');
    }

    for(const blackListTokens of fetchAllBlackListTokensResult) {
      const expiresAtIso = blackListTokens.expires_at;
      const expiresAt = moment(expiresAtIso).format('YYYY-MM-DD HH:mm:ss');

      const date = new Date();
      const dateNow = moment(date).format('YYYY-MM-DD HH:mm:ss');
      if(dateNow === expiresAt || dateNow > expiresAt) {
        const sql_1 = `DELETE FROM token_blacklist WHERE token = ?`;
        const [deleteResult_1] = await db.query(sql_1, [blackListTokens.token]);

        if (deleteResult_1.affectedRows > 0) {
          // หาค่า MAX(id) จากตาราง token_blacklist เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
          const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM token_blacklist');
          const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

          // รีเซ็ตค่า AUTO_INCREMENT
          await db.query('ALTER TABLE token_blacklist AUTO_INCREMENT = ?', [nextAutoIncrement]);
          console.log('Remove Token BlackListTokens ที่หมดเวลาเสร็จสิ้น!!');
        }
      }
    }
  } catch (error) {
    console.error("Error checkBlackListTokensExpired: ", error.message);
    process.exit(1);
  }
}

// Function ในการตรวจสอบ is_active, expires_at บน Table auth_tokens
async function checkAuthTokensExpired() {
  try {
    const [fetchAllAuthTokensResult] = await db.query('SELECT token, expires_at, is_active FROM auth_tokens');
    if (fetchAllAuthTokensResult.length === 0) {
        console.log('AuthTokenErrors : No tokens found in database');
    }

    for(const authTokens of fetchAllAuthTokensResult) {
      const expiresAtIso = authTokens.expires_at;
      const expiresAt = moment(expiresAtIso).format('YYYY-MM-DD HH:mm:ss');

      const date = new Date();
      const dateNow = moment(date).format('YYYY-MM-DD HH:mm:ss');
      
      if(dateNow === expiresAt || dateNow > expiresAt) {
        const sql_1 = `DELETE FROM auth_tokens WHERE token = ?`;
        const [deleteResult_1] = await db.query(sql_1, [authTokens.token]);

        if (deleteResult_1.affectedRows > 0) {
          // หาค่า MAX(id) จากตาราง auth_tokens เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
          const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM auth_tokens');
          const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

          // รีเซ็ตค่า AUTO_INCREMENT
          await db.query('ALTER TABLE auth_tokens AUTO_INCREMENT = ?', [nextAutoIncrement]);
          console.log('Remove Token AuthTokens ที่หมดเวลาเสร็จสิ้น!!');
        }
      }
    }     
  } catch (error) {
    console.error("Error checkAuthTokensExpired: ", error.message);
    process.exit(1);
  }
}

// เริ่มการตรวจสอบ
function startBlacklistScheduler() {
  // เรียกครั้งแรก
  checkAuthTokensExpired();
  checkBlackListTokensExpired();

  // ตั้งตารางทุก 1 นาที
  schedule.scheduleJob('0 * * * *', async () => {
      console.log('Scheduled blacklist update starting...');
      await checkAuthTokensExpired();
      await checkBlackListTokensExpired();
  });
}

startBlacklistScheduler();

module.exports = app;