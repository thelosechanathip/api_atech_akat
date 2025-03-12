const { 
    fetchTeacherData,
    checkTeacherPrefixsIdData,
    checkTeacherNationalIdData,
    checkTeacherGendersIdData,
    checkTeacherEmailData,
    checkTeacherSubDisctrictsIdData,
    checkTeacherDisctrictsIdData,
    checkTeacherProvincesIdData,
    checkTeacherProgramsIdData,
    checkTeacherPositionsIdData,
    checkTeacherStatusIdData,
    addTeacherData,
    checkIdTeacherData,
    updateTeacherData,
    removeTeacherData
} = require('../../models/members/teacherModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Teacher (ข้อมูลอาจารย์)
exports.getAllDataTeacher = async (req, res) => {
    try {
        const fetchTeacherDataResult = await fetchTeacherData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchTeacherDataResult) || fetchTeacherDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchTeacherDataResult);
    } catch (error) {
        console.error("Error fetching tacher data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Teacher (ข้อมูลอาจารย์)
exports.addDataTeacher = async (req, res) => {
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
        } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (
            !prefixes_id ||
            !first_name ||
            !last_name ||
            !genders_id ||
            !date_of_birth ||
            !national_id ||
            !phone_number ||
            !email ||
            !house_number ||
            !village_group ||
            !subdistricts_id ||
            !districts_id ||
            !provinces_id ||
            !programs_id ||
            !positions_id ||
            !start_date ||
            !image ||
            !teacher_status_id ||
            !created_by || 
            !updated_by 
        )  return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherPrefixsIdDataResult = await checkTeacherPrefixsIdData(prefixes_id);
        if (!checkTeacherPrefixsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');

        // ตรวจสอบว่าไม่ให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมา
        const firstNameRegex = /^[A-Za-zก-๙]+$/;
        const lastNameRegex = /^[A-Za-zก-๙]+$/;
        if (!firstNameRegex.test(first_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องชื่อจริง');
        if (!lastNameRegex.test(last_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องนามสกุล');

        // Check genders_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherGendersIdDataResult = await checkTeacherGendersIdData(genders_id);
        if (!checkTeacherGendersIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลเพศ) กรุณาเพิ่มข้อมูลเพศก่อนลงทะเบียน!');

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherNationalIdDataResult = await checkTeacherNationalIdData(national_id);
        if (checkTeacherNationalIdDataResult) return msg(res, 400, 'มี (national_id) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาว 10 ตัวและตรงกับรูปแบบที่กำหนด
        if (phone_number && (phone_number.length !== 10)) return msg(res, 400, 'รูปแบบหมายเลขโทรศัพท์ต้องมีความยาว 10 หลัก');

        // ตรวจสอบรูปแบบของ Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return msg(res, 400, 'รูปแบบของ Email ไม่ถูกต้องกรุณาตรวจสอบ!!');

        // Check email ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherEmailDataResult = await checkTeacherEmailData(email);
        if (checkTeacherEmailDataResult) return msg(res, 400, 'มี (email) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check subdistricts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherSubDisctrictsIdDataResult = await checkTeacherSubDisctrictsIdData(subdistricts_id);
        if (!checkTeacherSubDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำบล) กรุณาเพิ่มข้อมูลตำบลก่อนลงทะเบียน!');

        // Check districts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherDisctrictsIdDataResult = await checkTeacherDisctrictsIdData(districts_id);
        if (!checkTeacherDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) กรุณาเพิ่มข้อมูลอำเภอก่อนลงทะเบียน!');

        // Check provinces_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherProvincesIdDataResult = await checkTeacherProvincesIdData(provinces_id);
        if (!checkTeacherProvincesIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) กรุณาเพิ่มข้อมูลจังหวัดก่อนลงทะเบียน!');

        // Check programs_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherProgramsIdDataResult = await checkTeacherProgramsIdData(programs_id);
        if (!checkTeacherProgramsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสาขาวิชา) กรุณาเพิ่มข้อมูลสาขาวิชาก่อนลงทะเบียน!');

        // Check positions_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherPositionsIdDataResult = await checkTeacherPositionsIdData(positions_id);
        if (!checkTeacherPositionsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำแหน่ง) กรุณาเพิ่มข้อมูลตำแหน่งก่อนลงทะเบียน!');

        // Check อักขระของข้อมูล Image ที่ถูกส่งเข้ามา
        const isValidBase64Image = (imageData) => {
            const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/;
            return base64Regex.test(imageData);
        }
        if (!isValidBase64Image(image)) return msg(res, 400, 'รูปแบบของ Image ไม่ถูกต้องกรุณาตรวจสอบและแก้ไข!');

        // Check teacher_status_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherStatusIdDataResult = await checkTeacherStatusIdData(teacher_status_id);
        if (!checkTeacherStatusIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสถานะอาจารย์) กรุณาเพิ่มข้อมูลสถานะอาจารย์ก่อนลงทะเบียน!');

        // ตรวจสอบวันที่เริ่มงาน (Start Date)
        const currentDate = new Date();
        if (new Date(start_date) > currentDate) return msg(res, 400, 'วันที่เริ่มงานไม่สามารถเป็นวันในอนาคต');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addTeacherDataResult = await addTeacherData(req.body);
        if (addTeacherDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Teacher (ข้อมูลอาจารย์)
exports.updateDataTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTeacherDataResult = await checkIdTeacherData(id);
        if (!checkIdTeacherDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์) อยู่ในระบบ!');
        }

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
        } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (
            !prefixes_id ||
            !first_name ||
            !last_name ||
            !genders_id ||
            !date_of_birth ||
            !national_id ||
            !phone_number ||
            !email ||
            !house_number ||
            !village_group ||
            !subdistricts_id ||
            !districts_id ||
            !provinces_id ||
            !programs_id ||
            !positions_id ||
            !start_date ||
            !image ||
            !teacher_status_id ||
            !updated_by 
        )  return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherPrefixsIdDataResult = await checkTeacherPrefixsIdData(prefixes_id);
        if (!checkTeacherPrefixsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');

        // ตรวจสอบว่าไม่ให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมา
        const firstNameRegex = /^[A-Za-zก-๙]+$/;
        const lastNameRegex = /^[A-Za-zก-๙]+$/;
        if (!firstNameRegex.test(first_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องชื่อจริง');
        if (!lastNameRegex.test(last_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องนามสกุล');

        // Check genders_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherGendersIdDataResult = await checkTeacherGendersIdData(genders_id);
        if (!checkTeacherGendersIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลเพศ) กรุณาเพิ่มข้อมูลเพศก่อนลงทะเบียน!');

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherNationalIdDataResult = await checkTeacherNationalIdData(national_id);
        if (checkTeacherNationalIdDataResult) return msg(res, 400, 'มี (national_id) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาว 10 ตัวและตรงกับรูปแบบที่กำหนด
        if (phone_number && (phone_number.length !== 10)) return msg(res, 400, 'รูปแบบหมายเลขโทรศัพท์ต้องมีความยาว 10 หลัก');

        // ตรวจสอบรูปแบบของ Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return msg(res, 400, 'รูปแบบของ Email ไม่ถูกต้องกรุณาตรวจสอบ!!');

        // Check email ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherEmailDataResult = await checkTeacherEmailData(email);
        if (checkTeacherEmailDataResult) return msg(res, 400, 'มี (email) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check subdistricts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherSubDisctrictsIdDataResult = await checkTeacherSubDisctrictsIdData(subdistricts_id);
        if (!checkTeacherSubDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำบล) กรุณาเพิ่มข้อมูลตำบลก่อนลงทะเบียน!');

        // Check districts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherDisctrictsIdDataResult = await checkTeacherDisctrictsIdData(districts_id);
        if (!checkTeacherDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) กรุณาเพิ่มข้อมูลอำเภอก่อนลงทะเบียน!');

        // Check provinces_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherProvincesIdDataResult = await checkTeacherProvincesIdData(provinces_id);
        if (!checkTeacherProvincesIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) กรุณาเพิ่มข้อมูลจังหวัดก่อนลงทะเบียน!');

        // Check programs_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherProgramsIdDataResult = await checkTeacherProgramsIdData(programs_id);
        if (!checkTeacherProgramsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสาขาวิชา) กรุณาเพิ่มข้อมูลสาขาวิชาก่อนลงทะเบียน!');

        // Check positions_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherPositionsIdDataResult = await checkTeacherPositionsIdData(positions_id);
        if (!checkTeacherPositionsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำแหน่ง) กรุณาเพิ่มข้อมูลตำแหน่งก่อนลงทะเบียน!');

        // Check อักขระของข้อมูล Image ที่ถูกส่งเข้ามา
        const isValidBase64Image = (imageData) => {
            const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/;
            return base64Regex.test(imageData);
        }
        if (!isValidBase64Image(image)) return msg(res, 400, 'รูปแบบของ Image ไม่ถูกต้องกรุณาตรวจสอบและแก้ไข!');

        // Check teacher_status_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTeacherStatusIdDataResult = await checkTeacherStatusIdData(teacher_status_id);
        if (!checkTeacherStatusIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสถานะอาจารย์) กรุณาเพิ่มข้อมูลสถานะอาจารย์ก่อนลงทะเบียน!');

        // ตรวจสอบวันที่เริ่มงาน (Start Date)
        const currentDate = new Date();
        if (new Date(start_date) > currentDate) return msg(res, 400, 'วันที่เริ่มงานไม่สามารถเป็นวันในอนาคต');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateTeacherDataResult = await updateTeacherData(id, req.body);
        if (updateTeacherDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล Teacher( ข้อมูลอาจารย์ )
exports.removeDataTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTeacherDataResult = await checkIdTeacherData(id);
        if (!checkIdTeacherDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์) อยู่ในระบบ!');
        }

        const removeTeacherDataResult = await removeTeacherData(id, req.body);
        if (removeTeacherDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}