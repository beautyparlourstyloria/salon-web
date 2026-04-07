const express = require('express');
const router = express.Router();
const { Gallery, Offer, Bridal, Category } = require('../models/DataModels');

const initialCategories = [
    {
        id: "hair", label: "💇‍♀️ Hair", iconName: "Scissors",
        services: [
            { id: "s1", name: "Haircut", price: "₹499" },
            { id: "s2", name: "Hair Spa", price: "₹1,299" },
            { id: "s3", name: "Hair Smoothening", price: "₹4,999" },
            { id: "s4", name: "Hair Coloring", price: "₹2,499" },
            { id: "s5", name: "Keratin Treatment", price: "₹5,999" },
        ]
    },
    {
        id: "makeup", label: "💄 Makeup", iconName: "Sparkles",
        services: [
            { id: "s6", name: "Party Makeup", price: "₹2,999" },
            { id: "s7", name: "Engagement Makeup", price: "₹4,999" },
            { id: "s8", name: "Bridal HD Makeup", price: "₹9,999" },
            { id: "s9", name: "Airbrush Bridal", price: "₹12,999" },
        ]
    },
    {
        id: "nails", label: "💅 Nails", iconName: "Heart",
        services: [
            { id: "s10", name: "Manicure", price: "₹799" },
            { id: "s11", name: "Pedicure", price: "₹999" },
            { id: "s12", name: "Nail Extensions", price: "₹1,999" },
            { id: "s13", name: "Gel Polish", price: "₹699" },
        ]
    },
    {
        id: "skin", label: "🌸 Skin & Facial", iconName: "Flower2",
        services: [
            { id: "s14", name: "Cleanup", price: "₹899" },
            { id: "s15", name: "Fruit Facial", price: "₹1,299" },
            { id: "s16", name: "Gold Facial", price: "₹1,999" },
            { id: "s17", name: "Hydra Facial", price: "₹3,999" },
        ]
    }
];

const initialOffers = [
    { id: "o1", iconName: "Gem", title: "Monthly Glow Membership", price: "₹1,999/mo", originalPrice: "₹2,800/mo", desc: "1 Facial + 1 Hair Spa + 10% off all services", tag: "Membership", tagColor: "bg-primary", isMembership: true },
    { id: "o2", iconName: "Gift", title: "Bridal Membership", price: "₹9,999", desc: "Complete pre-bridal care package over 3 months", tag: "Festival Offer", tagColor: "bg-primary", isMembership: true },
    { id: "o3", iconName: "Percent", title: "First Visit Offer", price: "20% OFF", desc: "Flat 20% discount on your first appointment", tag: "New Clients", tagColor: "bg-accent", isMembership: true },
    { id: "o4", iconName: "Users", title: "Refer & Earn", price: "₹500 OFF", desc: "Get ₹500 off for every friend you refer", tag: "Always Active", tagColor: "bg-emerald-500", isMembership: true },
    { id: "o5", iconName: "Sparkles", title: "Summer Glow Package", price: "₹2,499", originalPrice: "₹3,500", desc: "Facial + Hair Spa + Manicure — Beat the heat with radiant skin & hair", tag: "Summer Special", tagColor: "bg-amber-500", isMembership: false },
    { id: "o6", iconName: "Heart", title: "Valentine's Duo", price: "₹3,999", originalPrice: "₹5,500", desc: "Couple makeover — Makeup + Hair styling for two", tag: "Limited Time", tagColor: "bg-rose-500", isMembership: false },
];

const initialBridalPackages = [
    { id: "b1", name: "Silver Bridal", price: "₹14,999", tier: "silver", features: ["Bridal Makeup", "Hairstyling", "Draping", "Nail Art", "Complimentary Trial"] },
    { id: "b2", name: "Gold Bridal", price: "₹19,999", tier: "gold", popular: true, features: ["Bridal Makeup", "Hairstyling", "Draping", "Nail Art", "Complimentary Trial", "Hair Spa", "Facial"] },
    { id: "b3", name: "Platinum Bridal", price: "₹29,999", tier: "platinum", features: ["Airbrush Bridal Makeup", "Premium Hairstyling", "Draping", "Nail Extensions", "2 Trial Sessions", "Pre-Bridal Package", "Skincare Routine"] },
];

router.get('/all', async (req, res) => {
    try {
        let categories = await Category.find();
        if (categories.length === 0) {
            await Category.insertMany(initialCategories);
            categories = await Category.find();
        }
        
        let offers = await Offer.find();
        if (offers.length === 0) {
            await Offer.insertMany(initialOffers);
            offers = await Offer.find();
        }
        
        let bridalPackages = await Bridal.find();
        if (bridalPackages.length === 0) {
            await Bridal.insertMany(initialBridalPackages);
            bridalPackages = await Bridal.find();
        }

        let media = await Gallery.find();

        res.status(200).json({ categories, offers, bridalPackages, media });
    } catch(err) {
        res.status(500).json({ message: "Failed to fetch data", error: err.message });
    }
});

// MEDIA
router.post('/media', async (req, res) => {
    try {
        const item = new Gallery(req.body);
        await item.save(); res.json(item);
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.put('/media/:id', async (req, res) => {
    try {
        await Gallery.findOneAndUpdate({id: req.params.id}, req.body, {new: true}); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.delete('/media/:id', async (req, res) => {
    try {
        await Gallery.findOneAndDelete({id: req.params.id}); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});

// OFFERS
router.post('/offer', async (req, res) => {
    try {
        const item = new Offer(req.body);
        await item.save(); res.json(item);
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.put('/offer/:id', async (req, res) => {
    try {
        await Offer.findOneAndUpdate({id: req.params.id}, req.body); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.delete('/offer/:id', async (req, res) => {
    try {
        await Offer.findOneAndDelete({id: req.params.id}); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});

// BRIDAL
router.post('/bridal', async (req, res) => {
    try {
        const item = new Bridal(req.body);
        await item.save(); res.json(item);
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.put('/bridal/:id', async (req, res) => {
    try {
        await Bridal.findOneAndUpdate({id: req.params.id}, req.body); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.delete('/bridal/:id', async (req, res) => {
    try {
        await Bridal.findOneAndDelete({id: req.params.id}); res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});

// SERVICES
router.post('/category/:id/service', async (req, res) => {
    try {
        const cat = await Category.findOne({id: req.params.id});
        if(cat) {
            cat.services.push(req.body); 
            await cat.save();
        }
        res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.put('/category/:id/service/:serviceId', async (req, res) => {
    try {
        await Category.updateOne(
            { id: req.params.id, "services.id": req.params.serviceId },
            { $set: { "services.$.name": req.body.name, "services.$.price": req.body.price, "services.$.endPrice": req.body.endPrice } }
        );
        res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});
router.delete('/category/:id/service/:serviceId', async (req, res) => {
    try {
        const cat = await Category.findOne({id: req.params.id});
        if(cat) {
            cat.services = cat.services.filter(s => s.id !== req.params.serviceId);
            await cat.save();
        }
        res.json({success:true});
    } catch(err) { res.status(500).json({error: err.message}); }
});

module.exports = router;
