const app = require("./src/app");
const db = require("./src/config/db"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล
const PORT = process.env.PORT || 5000;

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testDatabaseConnection() {
  try {
    await db.query("SELECT 1"); // ทดสอบ query ง่ายๆ
    // console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์หากไม่สามารถเชื่อมต่อฐานข้อมูลได้
  }
}

// ทดสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่มเซิร์ฟเวอร์
testDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    // await db.query(
    //   `
    //     UPDATE auth_tokens
    //     SET 
    //       is_active = ?
    //   `,[false]
    // );
    console.log(`Server is running on port ${PORT}`);
  });
});