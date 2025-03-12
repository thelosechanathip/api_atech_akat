const db = require('../../config/db');

// ฟังก์ชันสำหรับดึงข้อมูล Teacher จากฐานข้อมูล
exports.fetchTeacherData = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM teachers"); // Query ข้อมูลจากตาราง teachers
        return rows; // ส่งคืนข้อมูลที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch teacher data");
    }
};

// Check ว่ามี PrefixsId บน Table prefixes หรือไม่?
exports.checkTeacherPrefixsIdData = async (prefixes_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM prefixes WHERE id = ?", [prefixes_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check prefixes_id data");
    }
}

// Check ว่ามี NationalId บน Table teachers หรือไม่?
exports.checkTeacherNationalIdData = async (national_id) => {
    try {
        const [rows] = await db.query("SELECT national_id FROM teachers WHERE national_id = ?", [national_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check national_id data");
    }
}

// Check ว่ามี GendersId บน Table genders หรือไม่?
exports.checkTeacherGendersIdData = async (genders_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM genders WHERE id = ?", [genders_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check genders_id data");
    }
}

// Check ว่ามี Email บน Table teachers หรือไม่?
exports.checkTeacherEmailData = async (email) => {
    try {
        const [rows] = await db.query("SELECT email FROM teachers WHERE email = ?", [email]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check email data");
    }
}

// Check ว่ามี SubDisctrictsId บน Table sub_districts หรือไม่?
exports.checkTeacherSubDisctrictsIdData = async (subdistricts_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM sub_districts WHERE id = ?", [subdistricts_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check subdistricts_id data");
    }
}

// Check ว่ามี DisctrictsId บน Table districts หรือไม่?
exports.checkTeacherDisctrictsIdData = async (districts_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM districts WHERE id = ?", [districts_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check districts_id data");
    }
}

// Check ว่ามี ProvincesId บน Table provinces หรือไม่?
exports.checkTeacherProvincesIdData = async (provinces_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM provinces WHERE id = ?", [provinces_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check provinces_id data");
    }
}

// Check ว่ามี ProgramsId บน Table programs หรือไม่?
exports.checkTeacherProgramsIdData = async (programs_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM programs WHERE id = ?", [programs_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check programs_id data");
    }
}

// Check ว่ามี PositionsId บน Table positions หรือไม่?
exports.checkTeacherPositionsIdData = async (positions_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM positions WHERE id = ?", [positions_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check positions_id data");
    }
}

// Check ว่ามี StatusId บน Table teacher_status หรือไม่?
exports.checkTeacherStatusIdData = async (teacher_status_id) => {
    try {
        const [rows] = await db.query("SELECT id FROM teacher_status WHERE id = ?", [teacher_status_id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check teacher_status_id data");
    }
}

// เพิ่มข้อมูลไปยัง Table teachers
exports.addTeacherData = async (data) => {
    try {
        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            date_of_birth,
            national_id,
            phone_number,
            email,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            programs_id,
            positions_id,
            start_date,
            image,
            teacher_status_id,
            created_by, 
            updated_by 
        } = data;

        // จัดการแปลง Base64 ให้กลายเป็น Buffer Binary
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary

        const [result] = await db.query(
            `
                INSERT INTO teachers (
                    prefixes_id,
                    first_name,
                    last_name,
                    genders_id,
                    date_of_birth,
                    national_id,
                    phone_number,
                    email,
                    house_number,
                    village_group,
                    subdistricts_id,
                    districts_id,
                    provinces_id,
                    programs_id,
                    positions_id,
                    start_date,
                    image,
                    teacher_status_id,
                    created_by, 
                    updated_by 
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                prefixes_id,
                first_name,
                last_name,
                genders_id,
                date_of_birth,
                national_id,
                phone_number,
                email,
                house_number,
                village_group,
                subdistricts_id,
                districts_id,
                provinces_id,
                programs_id,
                positions_id,
                start_date,
                imageBuffer,
                teacher_status_id,
                created_by, 
                updated_by 
            ]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add teacher data");
    }
};

// Check ว่ามี ID นี้อยู่ใน Table teachers หรือไม่?
exports.checkIdTeacherData = async (id) => {
    try {
        const [rows] = await db.query(`SELECT id FROM teachers WHERE id = ?`, [id]);
        return rows.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check id data");
    }
};

// อัพเดทข้อมูลไปยัง Table teachers
exports.updateTeacherData = async (id, data) => {
    try {
        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            date_of_birth,
            national_id,
            phone_number,
            email,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            programs_id,
            positions_id,
            start_date,
            image,
            teacher_status_id,
            updated_by 
        } = data;

        // จัดการแปลง Base64 ให้กลายเป็น Buffer Binary
        const base64Data = await image.split(',')[1]; // ลบส่วนหัวของ Base64
        const imageBuffer = await Buffer.from(base64Data, 'base64'); // แปลงข้อมูล base64 ให้กลายเป็น buffer binary

        const [result] = await db.query(
            `
                UPDATE teachers 
                SET 
                    prefixes_id = ?,
                    first_name = ?,
                    last_name = ?,
                    genders_id = ?,
                    date_of_birth = ?,
                    national_id = ?,
                    phone_number = ?,
                    email = ?,
                    house_number = ?,
                    village_group = ?,
                    subdistricts_id = ?,
                    districts_id = ?,
                    provinces_id = ?,
                    programs_id = ?,
                    positions_id = ?,
                    start_date = ?,
                    image = ?,
                    teacher_status_id = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [
                prefixes_id,
                first_name,
                last_name,
                genders_id,
                date_of_birth,
                national_id,
                phone_number,
                email,
                house_number,
                village_group,
                subdistricts_id,
                districts_id,
                provinces_id,
                programs_id,
                positions_id,
                start_date,
                imageBuffer,
                teacher_status_id,
                updated_by,
                id
            ]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update teacher data");
    }
};

// ลบข้อมูลบน Table teachers
exports.removeTeacherData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง teachers
        const [deleteResult] = await db.query('DELETE FROM teachers WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง teachers เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db.query('SELECT MAX(id) AS maxId FROM teachers');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db.query('ALTER TABLE teachers AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing teacher data:', err.message);
        throw new Error('Failed to remove teacher data');
    }
};