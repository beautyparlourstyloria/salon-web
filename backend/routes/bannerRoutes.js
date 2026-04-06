const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// Get all active banners (public)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching banners' });
    }
});

// Admin: Add a new banner image
router.post('/', async (req, res) => {
    try {
        const { imageUrl, title, subtitle, description, buttonText, buttonUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });
        
        const newBanner = new Banner({ imageUrl, title, subtitle, description, buttonText, buttonUrl });
        await newBanner.save();
        res.status(201).json({ message: 'Banner added successfully', banner: newBanner });
    } catch (err) {
        res.status(500).json({ message: 'Error adding banner', error: err.message });
    }
});

// Admin: Edit a banner
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatableFields = ["imageUrl", "title", "subtitle", "description", "buttonText", "buttonUrl", "isActive"];
        const updateData = {};
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });
        
        res.status(200).json({ message: 'Banner updated successfully', banner: updatedBanner });
    } catch (err) {
        res.status(500).json({ message: 'Error updating banner', error: err.message });
    }
});

// Admin: Delete a banner
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting banner' });
    }
});

module.exports = router;
