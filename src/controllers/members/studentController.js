const { 
    fetchStudentsData,
    insertStudentData
} = require('../../models/members/studentModel');
const moment = require('moment');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล Student (ข้อมูลนักศึกษา)
exports.getAllDataStudents = async (req, res) => {
    try {
        const fetchStudentDataResults = await fetchStudentsData(); // เรียกใช้ฟังก์ชันโดยตรง

        // Check ว่ามีข้อมูลใน Table หรือไม่?
        if (!Array.isArray(fetchStudentDataResults) || fetchStudentDataResults.length === 0) {
            return msg(res, 404, "No data found");
        }
        return msg(res, 200, fetchStudentDataResults);
    } catch (error) {
        console.error("Error getAllDataStudents data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
};

exports.registerDataStudent = async (req, res) => {
    try {
        const {
            prefix_id,
            first_name_thai,
            last_name_thai,
            first_name_english,
            last_name_english,
            national_id,
            date_of_birth,
            gender_id,
            nationality_id,
            ethnicity_id,
            religion_id,
            phone_number,
            email,
            house_number,
            village_group,
            sub_district_id,
            district_id,
            province_id,
            student_code,
            enrollment_term_id,
            educational_institution_id,
            education_level_id,
            father_prefix_id,
            father_first_name_thai,
            father_last_name_thai,
            father_national_id,
            father_marital_status_id,
            father_occupation_id,
            father_nationality_id,
            father_phone_number,
            mother_prefix_id,
            mother_first_name_thai,
            mother_last_name_thai,
            mother_national_id,
            mother_marital_status_id,
            mother_occupation_id,
            mother_nationality_id,
            mother_phone_number,
            guardian_prefix_id,
            guardian_first_name_thai,
            guardian_last_name_thai,
            guardian_national_id,
            guardian_relation_to_student,
            guardian_phone_number,
            guardian_occupation_id,
            guardian_nationality_id,
            guardian_house_number,
            guardian_village_group,
            guardian_sub_district_id,
            guardian_district_id,
            guardian_province_id,
            image,
            student_status_id
        } = req.body;

        const insertStudentDataResult = await insertStudentData(req.body, req.name);
        // if(insertStudentDataResult) return msg(res, 200, 'Register student successfully!');
        if(insertStudentDataResult) return msg(res, 200, insertStudentDataResult);
    } catch (error) {
        console.error("Error registerStudentData data:", error.message);
        return msg(res, 500, "Internal Server Error");
    }
}