const express = require('express');
const router = express.Router();
const { updateProfileImage, getAllUsers } = require('../controllers/userController');

// All Users Route uses admin controller essentially
router.get('/', getAllUsers);
router.put('/:id/profile-image', updateProfileImage);

module.exports = router;
