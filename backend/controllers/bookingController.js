const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { name, phone, email, service, date, time, beautician } = req.body;

        // Prevent overlapping active bookings for the same time
        const existing = await Booking.findOne({ date, time, status: { $nin: ['Cancelled', 'Declined'] } });
        if (existing) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const booking = new Booking({ name, phone, email, service, date, time, beautician });
        await booking.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error creating booking' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { email, phone } = req.query;
        if (!email && !phone) return res.status(400).json({ message: 'Provide email or phone' });

        const bookings = await Booking.find({ $or: [{ email }, { phone }] }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching user bookings' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        res.json({ message: 'Status updated', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error updating booking status' });
    }
};

exports.updateBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, service, beautician } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { date, time, service, beautician }, { new: true });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        res.json({ message: 'Booking details updated', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error updating booking details' });
    }
};
