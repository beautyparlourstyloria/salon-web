const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    src: String,
    type: String,
    label: String,
    category: String
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
    isMembership: Boolean
});

const bridalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    price: String,
    tier: String,
    popular: Boolean,
    features: [String]
});

const serviceSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: String,
    endPrice: String,
});

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    label: String,
    iconName: String,
    services: [serviceSchema]
});

module.exports = {
    Gallery: mongoose.model('Gallery', gallerySchema),
    Offer: mongoose.model('Offer', offerSchema),
    Bridal: mongoose.model('Bridal', bridalSchema),
    Category: mongoose.model('Category', categorySchema)
};
