const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});

const OtpModel = mongoose.model("otp", otpSchema);
module.exports = {
    OtpModel
};
