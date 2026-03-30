// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
// Increase body-parser limits for Base64 image payload handling
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Expose the 'uploads' directory statically at /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5001;
// Local Persistent Directory for MongoDB
const dbPath = path.join(__dirname, 'mongodb_data');
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

const startServer = async () => {
    try {
        console.log("Spinning up persistent local MongoDB Server...");
        const mongoServer = await MongoMemoryServer.create({
            instance: {
                dbPath: dbPath,
                storageEngine: 'wiredTiger'
            }
        });
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
        console.log(`Connected successfully to persistent disk MongoDB at ${mongoUri}`);

        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@styloria.com' });
        if (!adminExists) {
            await User.create({
                name: "Admin User",
                email: "admin@styloria.com",
                phone: "1234567890",
                password: "admin123", // Will be hashed by pre-save hook
                role: "admin",
                isEmailVerified: true
            });
            console.log("Seeded default admin user: admin@styloria.com / admin123");
        }

        app.listen(PORT, () => console.log(`Backend Auth Server running stably on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start backend server or mongodb instance:", err);
    }
};

startServer();
