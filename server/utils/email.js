const nodemailer = require("nodemailer");

const sendEventApprovalEmail = async (receiverEmail, eventTitle, organizerName) => {
    const transporter = nodemailer.createTransport({
        host: "SMTP.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: receiverEmail,
        subject: `You have a new event verification request on agnel events from ${organizerName} for ${eventTitle}`,
        html: `<p>You are receiving this mail because ${organizerName} club wants event verification from you for ${eventTitle} event. <br/><br/> Visit <a href='${process.env.FRONTENDURL}/approvals'>AgnelEvents</a> to view the event. </p>`,
    };

    await transporter.sendMail(mailOptions);
};

const sendForgetPasswordEmail = async (receiverEmail, password) => {
    const transporter = nodemailer.createTransport({
        host: "SMTP.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: receiverEmail,
        subject: `Forget password of agnelevents`,
        html: `<p>Your password for agnelevents is : <b>${password}</b><br/><br/>We recommend you to change the password after login or delete this email once you noted your password. This is to keep your password secret.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (receiverEmail, username, OTP) => {
    const transporter = nodemailer.createTransport({
        host: "SMTP.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: receiverEmail,
        subject: `Your OTP for Email Verification`,
        html: `<p>Dear ${username}, <br/>Your One Time Password (OTP) for email verification is: <b>${OTP}</b><br/>Please do not share it with anyone.<br/><br/>If you did not request this verification, please ignore this email.<br/><br/>Best regards,<br/>Agnel events, FCRIT</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendEventApprovalEmail,
    sendForgetPasswordEmail,
    sendOTPEmail
};
