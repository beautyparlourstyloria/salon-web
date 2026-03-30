const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User with this email already exists.' });

        // Generate Verification Tokens
        const emailToken = crypto.randomBytes(20).toString('hex');
        const role = email === 'admin@styloria.com' ? 'admin' : 'user';

        user = new User({
            name, email, phone, password,
            emailVerificationToken: emailToken,
            role
        });
        await user.save();

        // Send Verification Links
        const verifyUrl = `${CLIENT_URL}/verify-email/${emailToken}`;
        await sendEmail(email, 'Styloria - Verify your Email', `Click here to verify your account: ${verifyUrl}`);

        res.status(201).json({ message: 'Registration successful. Please verify your email.', demoVerifyUrl: verifyUrl, demoVerifyToken: emailToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.isEmailVerified = true;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during email verification' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Enforce validations
        if (!user.isEmailVerified) return res.status(403).json({ message: 'Please verify your email prior to logging in.' });

        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, profileImage: user.profileImage, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
        await sendEmail(email, 'Styloria - Password Reset', `Click here to reset your password: ${resetUrl}`);

        res.json({ message: 'Password reset link sent to your email', demoResetUrl: resetUrl, demoResetToken: resetToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error sending password reset link' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error resetting password' });
    }
};
