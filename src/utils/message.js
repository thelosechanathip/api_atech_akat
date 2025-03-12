// Function จัดการ Message Error และ Success
exports.msg = async (res, status, message) => {
    return res.status(status).json({ message: message });
}