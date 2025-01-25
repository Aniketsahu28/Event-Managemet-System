const nodemailer = require("nodemailer");

const sendEmail = async (receiverEmail, approvalTitle, organizerName) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.senderEmail,
        to: receiverEmail,
        subject: `You have new approval request on agnel events from ${organizerName} for ${approvalTitle}`,
        html: `<p>You are receiving this mail because ${organizerName} club wants approval from you for ${approvalTitle} event. <br/><br/> Visit <a href="https://agnelevents.vercel.app">AgnelEvents</a> to view the approval. </p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
