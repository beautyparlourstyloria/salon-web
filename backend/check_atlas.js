const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
    console.log("Connecting to Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    const bookings = await db.collection('bookings').find({}).toArray();
    console.log("Users in Atlas:", users);
    console.log("Bookings in Atlas:", bookings);
    process.exit(0);
}
inspect().catch(console.error);
