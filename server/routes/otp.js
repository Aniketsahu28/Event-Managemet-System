const { Router } = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { UserModel } = require('../models/user');
const { OtpModel } = require('../models/otp');
const { sendOTPEmail } = require('../utils/email');
const otpRouter = Router();

otpRouter.post('/generateOTP', userAuth, async (req, res) => {
    const userId = req.userId;
    const { username, email } = req.body;
    try {
        const user = await UserModel.findOne({ email }, { password: 0 });
        if (user) {
            res.status(400).json({
                message: "A user with this email already exists"
            })
        }
        else {
            const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
            await OtpModel.create({ userId, email, otp: newOTP })
            await sendOTPEmail(email, username, newOTP)
            res.status(200).json({
                message: "OTP sent on your email"
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

otpRouter.patch('/resendOTP', userAuth, async (req, res) => {
    const userId = req.userId;
    const { username, email } = req.body;
    try {
        const OTP = await OtpModel.findOne({ userId });
        if (OTP) {
            //update in the existing otp
            const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
            await OtpModel.updateOne({ userId }, { $set: { email, otp: newOTP } });
            await sendOTPEmail(email, username, newOTP)
            res.status(200).json({
                message: "OTP sent on your email"
            })
        }
        else {
            //generate new otp
            const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
            await OtpModel.create({ userId, email, otp: newOTP })
            await sendOTPEmail(email, username, newOTP)
            res.status(200).json({
                message: "OTP sent on your email"
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

otpRouter.patch('/verifyOTP', userAuth, async (req, res) => {
    const userId = req.userId;
    const { userEnteredOTP } = req.body;
    try {
        const OTP = await OtpModel.findOne({ userId });
        if (OTP) {
            let invalidOTP = false;
            for (let i = 0; i <= 3; i++) {
                if (userEnteredOTP[i] !== OTP.otp.charAt(i)) {
                    invalidOTP = true;
                    break;
                }
            }
            if (invalidOTP) {
                res.status(400).json({
                    message: "Invalid OTP"
                })
            }
            else {
                await UserModel.updateOne({ userId }, { $set: { isVerified: true, email: OTP.email } })
                await OtpModel.deleteOne({ userId })
                res.status(200).json({
                    message: "OTP verified successfully",
                    email: OTP.email
                })
            }
        }
        else {
            res.status(400).json({
                message: "OTP experied",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = {
    otpRouter
}