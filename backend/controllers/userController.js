const User = require('../models/User');

exports.updateProfileImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { profileImage } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profileImage = profileImage;
        await user.save();

        res.json({ message: 'Profile image updated successfully', profileImage });
    } catch (err) {
        res.status(500).json({ message: 'Server error updating profile image' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching users' });
    }
};
