const moment = require('moment');

exports.capitalizeFirstLetter = async (str) => {
    // ตรวจสอบว่าตัวอักษรตัวแรกเป็นตัวพิมพ์เล็กหรือไม่
    if (str.charAt(0) === str.charAt(0).toLowerCase()) {
        // เปลี่ยนตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    // ถ้าตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่อยู่แล้ว ให้คืนค่าข้อความเดิม
    return str;
}

exports.convertToThaiDateFormat = async (date_of_birth) => {
    let birthDate = moment(date_of_birth, "YYYY-MM-DD");
    let day = birthDate.format("DD");
    let month = birthDate.format("MM");
    let buddhistYear = birthDate.year() + 543;

    return `${day}${month}${buddhistYear}`;
}