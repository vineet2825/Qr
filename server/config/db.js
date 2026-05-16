const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qr_stock_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`FATAL ERROR: Could not connect to MongoDB.`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Check if MONGO_URI is set correctly in your Environment Variables.`);
        process.exit(1);
    }
};

module.exports = connectDB;
