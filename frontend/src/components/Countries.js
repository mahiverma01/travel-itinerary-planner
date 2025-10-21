import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Countries.css';

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBudget, setFilterBudget] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/countries');
                const data = await response.json();
                setCountries(data);
                setFilteredCountries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        let results = countries;

        // Search filter
        if (searchTerm) {
            results = results.filter(country =>
                country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                country.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                country.capital.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Budget filter
        if (filterBudget !== 'all') {
            results = results.filter(country => {
                const dailyBudget = country.budget?.daily || 0;
                switch (filterBudget) {
                    case 'budget':
                        return dailyBudget < 70;
                    case 'moderate':
                        return dailyBudget >= 70 && dailyBudget <= 120;
                    case 'luxury':
                        return dailyBudget > 120;
                    default:
                        return true;
                }
            });
        }

        setFilteredCountries(results);
    }, [searchTerm, filterBudget, countries]);

    if (loading) {
        return <div className="loading">Loading countries...</div>;
    }

    return (
        <div className="countries-container">
            <div className="countries-header">
                <h1>Explore Destinations</h1>
                <p>Discover amazing countries for your next adventure</p>
            </div>

            {/* Search and Filter Section */}
            <div className="search-filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search countries, cities, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-section">
                    <select
                        value={filterBudget}
                        onChange={(e) => setFilterBudget(e.target.value)}
                        className="budget-filter"
                    >
                        <option value="all">All Budgets</option>
                        <option value="budget">Budget ($0-70/day)</option>
                        <option value="moderate">Moderate ($70-120/day)</option>
                        <option value="luxury">Luxury ($120+/day)</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <p>Found {filteredCountries.length} countries</p>
            </div>

            {/* Countries Grid */}
            <div className="countries-grid">
                {filteredCountries.map(country => (
                    <div key={country._id} className="country-card">
                        <div className="country-image">
                            <img 
                                src={country.image} 
                                alt={country.name}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
                                }}
                            />
                            <div className="country-budget">
                                ${country.budget?.daily || 'N/A'}/day
                            </div>
                        </div>
                        <div className="country-info">
                            <h3>{country.name}</h3>
                            <p className="country-description">{country.description}</p>
                            <div className="country-details">
                                <span className="capital">🏛️ {country.capital}</span>
                                <span className="currency">💵 {country.currency}</span>
                            </div>
                            <div className="country-meta">
                                <span className={`safety ${country.safetyLevel?.toLowerCase().replace(' ', '-')}`}>
                                    🛡️ {country.safetyLevel}
                                </span>
                                {country.visaRequired && <span className="visa">🛂 Visa Required</span>}
                            </div>
                            <Link to={`/country/${country._id}`} className="view-details-btn">
                                View Details & Plan Trip
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCountries.length === 0 && (
                <div className="no-results">
                    <h3>No countries found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Countries;