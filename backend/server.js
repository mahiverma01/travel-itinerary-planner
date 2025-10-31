const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries'); // ADD THIS LINE
const tripsRoutes = require('./routes/trips'); // ADD if you have trips routes
const bookingsRoutes = require('./routes/bookings'); // ADD if you have bookings routes

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Routes - ADD ALL YOUR ROUTES HERE
app.use('/api/auth', authRoutes);
app.use('/api/countries', countriesRoutes); // ADD THIS LINE
// app.use('/api/trips', tripsRoutes); // Uncomment if you have trips
// app.use('/api/bookings', bookingsRoutes); // Uncomment if you have bookings

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Travel Itinerary Planner API is running!',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      countries: '/api/countries', // ADD THIS
      test: '/api/test'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test countries route - ADD THIS FOR TESTING
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-planner')
  .then(() => console.log('🌍 Connected to MongoDB'))
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Countries endpoint: http://localhost:${PORT}/api/countries`);
});