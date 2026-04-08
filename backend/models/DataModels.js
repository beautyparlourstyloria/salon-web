const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    src: String,
    type: String,
    label: String,
    category: String,
    isVisible: { type: Boolean, default: true }
});

const offerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    iconName: String,
    title: String,
    price: String,
    originalPrice: String,
    desc: String,
    tag: String,
    tagColor: String,
    isMembership: Boolean,
    isVisible: { type: Boolean, default: true },
    note: { type: String, default: "" },
    order: { type: Number, default: 0 }
});

const bridalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    price: String,
    tier: String,
    popular: Boolean,
    features: [String],
    isVisible: { type: Boolean, default: true },
    note: { type: String, default: "" },
    order: { type: Number, default: 0 }
});

const serviceSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: String,
    endPrice: String,
    isVisible: { type: Boolean, default: true },
    note: { type: String, default: "" },
    order: { type: Number, default: 0 }
});

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    label: String,
    iconName: String,
    order: { type: Number, default: 0 },
    services: [serviceSchema]
});

module.exports = {
    Gallery: mongoose.model('Gallery', gallerySchema),
    Offer: mongoose.model('Offer', offerSchema),
    Bridal: mongoose.model('Bridal', bridalSchema),
    Category: mongoose.model('Category', categorySchema)
};
