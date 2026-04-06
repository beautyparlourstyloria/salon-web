const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String }, // e.g. "Where Beauty Meets Confidence"
    subtitle: { type: String }, // e.g. "Premium Beauty Lounge"
    description: { type: String }, // e.g. "Experience luxury beauty treatments..."
    buttonText: { type: String }, // e.g. "Book Appointment"
    buttonUrl: { type: String }, // e.g. "#booking"
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
