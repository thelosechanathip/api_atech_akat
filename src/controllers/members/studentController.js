const { 
    fetchStudentData,
    checkStudentPrefixsIdData,
    checkStudentNationalIdData,
    checkStudentGendersIdData,
    checkStudentEmailData,
    checkStudentEnrollmentYearsIdData,
    checkStudentSubDisctrictsIdData,
    checkStudentDisctrictsIdData,
    checkStudentProvincesIdData,
    checkStudentLevelEducationIdData,
    checkStudentGradeLevelIdData,
    checkStudentProgramsIdData,
    checkStudentTeacherIdData,
    checkStudentStatusIdData,
    addStudentData,
    checkIdStudentData,
    updateStudentData,
    removeStudentData
} = require('../../models/members/studentModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Student (ข้อมูลนักศึกษา)
exports.getAllDataStudent = async (req, res) => {
    try {
        const fetchStudentDataResult = await fetchStudentData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchStudentDataResult) || fetchStudentDataResult.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchStudentDataResult);
    } catch (error) {
        console.error("Error fetching student data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

// ใช้สำหรับเพิ่มข้อมูล Student (ข้อมูลนักศึกษา)
exports.addDataStudent = async (req, res) => {
    try {
        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            national_id,
            date_of_birth,
            phone_number,
            email,
            enrollment_years_id,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            level_educations_id,
            grade_levels_id,
            programs_id,
            teachers_id,
            image,
            student_status_id,
            created_by, 
            updated_by 
        } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (
            !prefixes_id ||
            !first_name ||
            !last_name ||
            !genders_id ||
            !national_id ||
            !date_of_birth ||
            !phone_number ||
            !email ||
            !enrollment_years_id ||
            !house_number ||
            !village_group ||
            !subdistricts_id ||
            !districts_id ||
            !provinces_id ||
            !level_educations_id ||
            !grade_levels_id ||
            !programs_id ||
            !teachers_id ||
            !image ||
            !student_status_id ||
            !created_by || 
            !updated_by 
        )  return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentPrefixsIdDataResult = await checkStudentPrefixsIdData(prefixes_id);
        if (!checkStudentPrefixsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');

        // ตรวจสอบว่าไม่ให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมา
        const firstNameRegex = /^[A-Za-zก-๙]+$/;
        const lastNameRegex = /^[A-Za-zก-๙]+$/;
        if (!firstNameRegex.test(first_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องชื่อจริง');
        if (!lastNameRegex.test(last_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องนามสกุล');

        // Check genders_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentGendersIdDataResult = await checkStudentGendersIdData(genders_id);
        if (!checkStudentGendersIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลเพศ) กรุณาเพิ่มข้อมูลเพศก่อนลงทะเบียน!');

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentNationalIdDataResult = await checkStudentNationalIdData(national_id);
        if (checkStudentNationalIdDataResult) return msg(res, 400, 'มี (national_id) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาว 10 ตัวและตรงกับรูปแบบที่กำหนด
        if (phone_number && (phone_number.length !== 10)) return msg(res, 400, 'รูปแบบหมายเลขโทรศัพท์ต้องมีความยาว 10 หลัก');

        // ตรวจสอบรูปแบบของ Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return msg(res, 400, 'รูปแบบของ Email ไม่ถูกต้องกรุณาตรวจสอบ!!');

        // Check email ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentEmailDataResult = await checkStudentEmailData(email);
        if (checkStudentEmailDataResult) return msg(res, 400, 'มี (email) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check enrollment_years_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentEnrollmentYearsIdDataResult = await checkStudentEnrollmentYearsIdData(enrollment_years_id);
        if (!checkStudentEnrollmentYearsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลปีการศึกษา) กรุณาเพิ่มข้อมูลปีการศึกษาก่อนลงทะเบียน!');

        // Check subdistricts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentSubDisctrictsIdDataResult = await checkStudentSubDisctrictsIdData(subdistricts_id);
        if (!checkStudentSubDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำบล) กรุณาเพิ่มข้อมูลตำบลก่อนลงทะเบียน!');

        // Check districts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentDisctrictsIdDataResult = await checkStudentDisctrictsIdData(districts_id);
        if (!checkStudentDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) กรุณาเพิ่มข้อมูลอำเภอก่อนลงทะเบียน!');

        // Check provinces_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentProvincesIdDataResult = await checkStudentProvincesIdData(provinces_id);
        if (!checkStudentProvincesIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) กรุณาเพิ่มข้อมูลจังหวัดก่อนลงทะเบียน!');

        // Check level_educations_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentLevelEducationIdDataResult = await checkStudentLevelEducationIdData(level_educations_id);
        if (!checkStudentLevelEducationIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลการศึกษาระดับ) กรุณาเพิ่มข้อมูลการศึกษาระดับก่อนลงทะเบียน!');

        // Check grade_levels_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentGradeLevelIdDataResult = await checkStudentGradeLevelIdData(grade_levels_id);
        if (!checkStudentGradeLevelIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลระดับชั้น) กรุณาเพิ่มข้อมูลระดับชั้นก่อนลงทะเบียน!');

        // Check programs_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentProgramsIdDataResult = await checkStudentProgramsIdData(programs_id);
        if (!checkStudentProgramsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสาขาวิชา) กรุณาเพิ่มข้อมูลสาขาวิชาก่อนลงทะเบียน!');

        // Check teachers_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentTeacherIdDataResult = await checkStudentTeacherIdData(teachers_id);
        if (!checkStudentTeacherIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์ที่ปรึกษา) กรุณาเพิ่มข้อมูลอาจารย์ที่ปรึกษาก่อนลงทะเบียน!');

        // Check อักขระของข้อมูล Image ที่ถูกส่งเข้ามา
        const isValidBase64Image = (imageData) => {
            const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/;
            return base64Regex.test(imageData);
        }
        if (!isValidBase64Image(image)) return msg(res, 400, 'รูปแบบของ Image ไม่ถูกต้องกรุณาตรวจสอบและแก้ไข!');

        // Check student_status_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentStatusIdDataResult = await checkStudentStatusIdData(student_status_id);
        if (!checkStudentStatusIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสถานะนักศึกษา) กรุณาเพิ่มข้อมูลสถานะนักศึกษาก่อนลงทะเบียน!');

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addStudentDataResult = await addStudentData(req.body);
        if (addStudentDataResult) {
            return msg(res, 200, 'บันทึกข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'บันทึกข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล Student (ข้อมูลนักศึกษา)
exports.updateDataStudent = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdStudentDataResult = await checkIdStudentData(id);
        if (!checkIdStudentDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์) อยู่ในระบบ!');
        }

        const { 
            prefixes_id,
            first_name,
            last_name,
            genders_id,
            national_id,
            date_of_birth,
            phone_number,
            email,
            enrollment_years_id,
            house_number,
            village_group,
            subdistricts_id,
            districts_id,
            provinces_id,
            level_educations_id,
            grade_levels_id,
            programs_id,
            teachers_id,
            image,
            student_status_id,
            updated_by 
        } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (
            !prefixes_id ||
            !first_name ||
            !last_name ||
            !genders_id ||
            !national_id ||
            !date_of_birth ||
            !phone_number ||
            !email ||
            !enrollment_years_id ||
            !house_number ||
            !village_group ||
            !subdistricts_id ||
            !districts_id ||
            !provinces_id ||
            !level_educations_id ||
            !grade_levels_id ||
            !programs_id ||
            !teachers_id ||
            !image ||
            !student_status_id ||
            !updated_by 
        )  return msg(res, 400, 'กรุณากรอกข้อมูลให้ครบถ้วน');

        // Check prefix_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentPrefixsIdDataResult = await checkStudentPrefixsIdData(prefixes_id);
        if (!checkStudentPrefixsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลคำนำหน้า) กรุณาเพิ่มข้อมูลคำนำหน้าก่อนลงทะเบียน!');

        // ตรวจสอบว่าไม่ให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมา
        const firstNameRegex = /^[A-Za-zก-๙]+$/;
        const lastNameRegex = /^[A-Za-zก-๙]+$/;
        if (!firstNameRegex.test(first_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องชื่อจริง');
        if (!lastNameRegex.test(last_name)) return msg(res, 400, 'ไม่อนุญาตให้มีการส่งตัวอักขระพิเศษหรือตัวเลขมาในช่องนามสกุล');

        // Check genders_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentGendersIdDataResult = await checkStudentGendersIdData(genders_id);
        if (!checkStudentGendersIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลเพศ) กรุณาเพิ่มข้อมูลเพศก่อนลงทะเบียน!');

        // ตรวจสอบรูปแบบหมายเลขบัตรประชาชน (13 หลัก)
        const nationalIdRegex = /^[0-9]{13}$/;
        if (!nationalIdRegex.test(national_id)) return msg(res, 400, 'หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');

        // Check national_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentNationalIdDataResult = await checkStudentNationalIdData(national_id);
        if (checkStudentNationalIdDataResult) return msg(res, 400, 'มี (national_id) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาว 10 ตัวและตรงกับรูปแบบที่กำหนด
        if (phone_number && (phone_number.length !== 10)) return msg(res, 400, 'รูปแบบหมายเลขโทรศัพท์ต้องมีความยาว 10 หลัก');

        // ตรวจสอบรูปแบบของ Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return msg(res, 400, 'รูปแบบของ Email ไม่ถูกต้องกรุณาตรวจสอบ!!');

        // Check email ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentEmailDataResult = await checkStudentEmailData(email);
        if (checkStudentEmailDataResult) return msg(res, 400, 'มี (email) ข้อมูลอาจารย์ อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!');

        // Check enrollment_years_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentEnrollmentYearsIdDataResult = await checkStudentEnrollmentYearsIdData(enrollment_years_id);
        if (!checkStudentEnrollmentYearsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลปีการศึกษา) กรุณาเพิ่มข้อมูลปีการศึกษาก่อนลงทะเบียน!');

        // Check subdistricts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentSubDisctrictsIdDataResult = await checkStudentSubDisctrictsIdData(subdistricts_id);
        if (!checkStudentSubDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลตำบล) กรุณาเพิ่มข้อมูลตำบลก่อนลงทะเบียน!');

        // Check districts_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentDisctrictsIdDataResult = await checkStudentDisctrictsIdData(districts_id);
        if (!checkStudentDisctrictsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอำเภอ) กรุณาเพิ่มข้อมูลอำเภอก่อนลงทะเบียน!');

        // Check provinces_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentProvincesIdDataResult = await checkStudentProvincesIdData(provinces_id);
        if (!checkStudentProvincesIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลจังหวัด) กรุณาเพิ่มข้อมูลจังหวัดก่อนลงทะเบียน!');

        // Check level_educations_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentLevelEducationIdDataResult = await checkStudentLevelEducationIdData(level_educations_id);
        if (!checkStudentLevelEducationIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลการศึกษาระดับ) กรุณาเพิ่มข้อมูลการศึกษาระดับก่อนลงทะเบียน!');

        // Check grade_levels_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentGradeLevelIdDataResult = await checkStudentGradeLevelIdData(grade_levels_id);
        if (!checkStudentGradeLevelIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลระดับชั้น) กรุณาเพิ่มข้อมูลระดับชั้นก่อนลงทะเบียน!');

        // Check programs_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentProgramsIdDataResult = await checkStudentProgramsIdData(programs_id);
        if (!checkStudentProgramsIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสาขาวิชา) กรุณาเพิ่มข้อมูลสาขาวิชาก่อนลงทะเบียน!');

        // Check teachers_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentTeacherIdDataResult = await checkStudentTeacherIdData(teachers_id);
        if (!checkStudentTeacherIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์ที่ปรึกษา) กรุณาเพิ่มข้อมูลอาจารย์ที่ปรึกษาก่อนลงทะเบียน!');

        // Check อักขระของข้อมูล Image ที่ถูกส่งเข้ามา
        const isValidBase64Image = (imageData) => {
            const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/;
            return base64Regex.test(imageData);
        }
        if (!isValidBase64Image(image)) return msg(res, 400, 'รูปแบบของ Image ไม่ถูกต้องกรุณาตรวจสอบและแก้ไข!');

        // Check student_status_id ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkStudentStatusIdDataResult = await checkStudentStatusIdData(student_status_id);
        if (!checkStudentStatusIdDataResult) return msg(res, 400, 'ไม่มี (ข้อมูลสถานะนักศึกษา) กรุณาเพิ่มข้อมูลสถานะนักศึกษาก่อนลงทะเบียน!');

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateStudentDataResult = await updateStudentData(id, req.body);
        if (updateStudentDataResult) {
            return msg(res, 200, 'อัพเดทข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'อัพเดทข้อมูลไม่สำเร็จ!');
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, err.message); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};


// ใช้สำหรับลบข้อมูล Student( ข้อมูลนักศึกษา )
exports.removeDataStudent = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdStudentDataResult = await checkIdStudentData(id);
        if (!checkIdStudentDataResult) {
            return msg(res, 400, 'ไม่มี (ข้อมูลอาจารย์) อยู่ในระบบ!');
        }

        const removeStudentDataResult = await removeStudentData(id, req.body);
        if (removeStudentDataResult) {
            return msg(res, 200, 'ลบข้อมูลเสร็จสิ้น!');
        } else {
            return msg(res, 400, 'ลบข้อมูลไม่สำเร็จ!');
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, err);
    }
}