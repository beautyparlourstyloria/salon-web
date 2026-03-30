const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    updateBookingDetails
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/user', getUserBookings);
router.patch('/:id/status', updateBookingStatus);
router.put('/:id', updateBookingDetails);

module.exports = router;
