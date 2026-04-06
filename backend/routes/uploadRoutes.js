const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads dir
if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
    fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp|svg|heic|heif|jfif|bmp|avif|tiff/;
        const mimetype = file.mimetype.startsWith('image/');
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype || extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports images"));
    }
});

// Admin ONLY can upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert the uploaded image buffer to a heavily compressed JPEG IN MEMORY
        // This prevents Heroku/Render ephemeral disk wipes and easily avoids the 16MB MongoDB limit!
        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, force: true })
            .toBuffer();

        // Convert back to base64 (it will be ~500KB instead of 10MB+, easily fitting in DB & React Native storage)
        const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        
        res.status(200).json({ 
            message: 'Image compressed & uploaded perfectly for Live servers',
            url: base64Image
        });
    } catch (err) {
        console.error("Upload/Compression Error:", err);
        res.status(500).json({ message: 'Compression Failed Server-side', error: err.message });
    }
});

module.exports = router;
