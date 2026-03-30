const twilio = require('twilio');

const sendSms = async (to, body) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.warn('⚠️ TWILIO SECRETS NOT CONFIGURED. Skipping real SMS dispatch. Log dump:', { to, body });
            return;
        }

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
            to
        });
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

module.exports = sendSms;
