require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧳 Testing Travel Itinerary Planner Database Connection...\n');

const connStr = process.env.MONGODB_URI;
if (!connStr) {
    console.log('❌ MONGODB_URI not found in .env file');
    process.exit(1);
}

// Show connection string with password hidden
const safeStr = connStr.replace(/:[^:]*@/, ':****@');
console.log('Connection:', safeStr);

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ SUCCESS: Travel Itinerary Planner Database Connected!');
        console.log(`📁 Database: ${mongoose.connection.name}`);
        await mongoose.connection.close();
        console.log('🔒 Connection closed.');
    } catch (error) {
        console.log('\n❌ ERROR:', error.message);
        console.log('\n💡 TIPS:');
        console.log('1. Check your username/password in .env');
        console.log('2. Make sure database user exists in Atlas');
        console.log('3. Check Network Access in Atlas');
        console.log('4. Verify connection string format');
    }
}

testConnection();