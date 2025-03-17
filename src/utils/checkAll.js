exports.capitalizeFirstLetter = (str) => {
    // ตรวจสอบว่าตัวอักษรตัวแรกเป็นตัวพิมพ์เล็กหรือไม่
    if (str.charAt(0) === str.charAt(0).toLowerCase()) {
        // เปลี่ยนตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    // ถ้าตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่อยู่แล้ว ให้คืนค่าข้อความเดิม
    return str;
}