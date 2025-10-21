const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('🌍 Connecting to Travel Itinerary Planner Database...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
    } catch (error) {
        console.error('❌ Travel Itinerary Planner Database connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('auth failed')) {
            console.log('\n🔐 AUTHENTICATION TIPS:');
            console.log('1. Check your username/password in .env file');
            console.log('2. Make sure you created a database user in Atlas');
            console.log('3. Verify the database name: travel-itinerary-planner');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;