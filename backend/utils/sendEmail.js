const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Note: To use gmail, user must configure process.env.EMAIL_USER and EMAIL_PASS
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ EMAIL SECRETS NOT CONFIGURED. Skiping real email dispatch. Log dump:', { to, subject, text });
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
