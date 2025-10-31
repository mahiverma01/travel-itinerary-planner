import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Countries from './components/Countries';
import CountryDetail from './components/CountryDetail';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import Profile from './components/Profile';
import BookingConfirmation from './components/BookingConfirmation';
import './App.css';

// Temporary debug component
const DebugRoutes = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🚀 Debug Navigation</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')}>Test Dashboard</button>
        <button onClick={() => navigate('/countries')}>Test Countries</button>
        <button onClick={() => navigate('/country/france')}>Test Country Detail</button>
        <button onClick={() => navigate('/book-trip/123')}>Test Booking Form</button>
        <button onClick={() => navigate('/my-bookings')}>Test My Bookings</button>
        <button onClick={() => navigate('/booking-confirmation')}>Test Confirmation</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/country/:id" element={<CountryDetail />} />
            <Route path="/book-trip/:countryId" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/debug" element={<DebugRoutes />} /> {/* Add this line */}
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;