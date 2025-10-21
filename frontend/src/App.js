import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;