import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './CountryDetail.css';

const CountryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [country, setCountry] = useState(null);
  const [notes, setNotes] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    fetchCountry();
  }, [id]);

  const fetchCountry = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/countries/${id}`);
      setCountry(response.data);
      setSelectedPlaces(response.data.popularPlaces || []);
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  };

  const handlePlaceToggle = (place) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(selectedPlaces.filter(p => p !== place));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const saveTrip = async () => {
    if (!currentUser) {
      alert('Please login to save trips');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/trips', {
        userId: currentUser.userId,
        country: country.name,
        notes,
        places: selectedPlaces
      });
      alert('Trip saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error saving trip');
    }
  };

  if (!country) return <div>Loading...</div>;

  return (
    <div className="country-detail">
      <button className="back-btn" onClick={() => navigate('/countries')}>← Back</button>
      
      <div className="country-hero">
        <img src={country.image} alt={country.name} />
        <div className="hero-overlay">
          <h1>{country.name}</h1>
          <p>{country.description}</p>
          
          <div className="hero-actions">
            <Link to={`/book/${country._id}`} className="book-now-btn">
              Book This Trip
            </Link>
          </div>
        </div>
      </div>

      <div className="trip-planner">
        <div className="notes-section">
          <h3>Notes</h3>
          <textarea
            placeholder="Add your trip notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
          />
        </div>

        <div className="places-section">
          <h3>Select Places to Visit</h3>
          <div className="places-list">
            {(country.popularPlaces || country.popularAttractions || []).map(place => (
              <div key={place} className="place-item">
                <input
                  type="checkbox"
                  checked={selectedPlaces.includes(place)}
                  onChange={() => handlePlaceToggle(place)}
                />
                <span>{place}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="save-trip-btn" onClick={saveTrip}>
            Save Trip Plan
          </button>
          
          <Link to={`/book/${country._id}`} className="book-now-btn secondary">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;