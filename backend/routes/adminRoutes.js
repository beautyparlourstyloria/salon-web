const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        if (!to || !subject || !text) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        await sendEmail(to, subject, text);
        res.json({ message: 'Email sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error sending email', error: err.message });
    }
});

module.exports = router;
