require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('./models/Country');

const seedCountries = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const countries = [
            {
                name: 'France',
                code: 'FR',
                capital: 'Paris',
                currency: 'Euro',
                language: 'French',
                budget: { daily: 120, currency: 'USD' },
                description: 'Known for its romantic ambiance, exquisite cuisine, and rich history including the Eiffel Tower and Louvre Museum.',
                image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['April-June', 'September-October'],
                popularAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'French Riviera'],
                visaRequired: true,
                safetyLevel: 'Safe'
            },
            {
                name: 'Japan',
                code: 'JP',
                capital: 'Tokyo',
                currency: 'Yen',
                language: 'Japanese',
                budget: { daily: 100, currency: 'USD' },
                description: 'A perfect blend of ancient traditions and cutting-edge technology, from serene temples to bustling city life.',
                image: 'https://images.unsplash.com/photo-1540959733332-57c6df1b268b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['March-May', 'September-November'],
                popularAttractions: ['Mount Fuji', 'Tokyo Tower', 'Kyoto Temples', 'Osaka Castle'],
                visaRequired: true,
                safetyLevel: 'Very Safe'
            },
            {
                name: 'Italy',
                code: 'IT',
                capital: 'Rome',
                currency: 'Euro',
                language: 'Italian',
                budget: { daily: 110, currency: 'USD' },
                description: 'Famous for its art, historical landmarks, delicious cuisine, and beautiful coastline along the Mediterranean Sea.',
                image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['April-June', 'September-October'],
                popularAttractions: ['Colosseum', 'Venice Canals', 'Florence Duomo', 'Amalfi Coast'],
                visaRequired: true,
                safetyLevel: 'Safe'
            },
            {
                name: 'Thailand',
                code: 'TH',
                capital: 'Bangkok',
                currency: 'Baht',
                language: 'Thai',
                budget: { daily: 50, currency: 'USD' },
                description: 'Known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha.',
                image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['November-February'],
                popularAttractions: ['Bangkok Temples', 'Phuket Beaches', 'Chiang Mai', 'Phi Phi Islands'],
                visaRequired: false,
                safetyLevel: 'Moderate'
            },
            {
                name: 'United States',
                code: 'US',
                capital: 'Washington D.C.',
                currency: 'US Dollar',
                language: 'English',
                budget: { daily: 150, currency: 'USD' },
                description: 'Diverse landscapes from skyscrapers of New York to natural wonders like the Grand Canyon and Yellowstone.',
                image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['April-June', 'September-October'],
                popularAttractions: ['Grand Canyon', 'New York City', 'Yellowstone', 'Golden Gate Bridge'],
                visaRequired: true,
                safetyLevel: 'Moderate'
            },
            {
                name: 'Australia',
                code: 'AU',
                capital: 'Canberra',
                currency: 'Australian Dollar',
                language: 'English',
                budget: { daily: 130, currency: 'USD' },
                description: 'Home to unique wildlife, stunning beaches, the Outback, and vibrant cities like Sydney and Melbourne.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['September-November', 'March-May'],
                popularAttractions: ['Sydney Opera House', 'Great Barrier Reef', 'Uluru', 'Bondi Beach'],
                visaRequired: true,
                safetyLevel: 'Safe'
            },
            {
                name: 'Canada',
                code: 'CA',
                capital: 'Ottawa',
                currency: 'Canadian Dollar',
                language: 'English, French',
                budget: { daily: 100, currency: 'USD' },
                description: 'Vast wilderness, multicultural cities, and natural wonders like Niagara Falls and the Rocky Mountains.',
                image: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['June-August', 'December-March (for skiing)'],
                popularAttractions: ['Niagara Falls', 'Banff National Park', 'CN Tower', 'Old Quebec'],
                visaRequired: true,
                safetyLevel: 'Very Safe'
            },
            {
                name: 'Spain',
                code: 'ES',
                capital: 'Madrid',
                currency: 'Euro',
                language: 'Spanish',
                budget: { daily: 80, currency: 'USD' },
                description: 'Famous for its vibrant culture, beautiful beaches, historic cities, and delicious tapas cuisine.',
                image: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                bestTimeToVisit: ['April-June', 'September-October'],
                popularAttractions: ['Sagrada Familia', 'Alhambra', 'Park Güell', 'Ibiza Beaches'],
                visaRequired: true,
                safetyLevel: 'Safe'
            }
        ];

        await Country.deleteMany({});
        await Country.insertMany(countries);
        
        console.log('✅ Sample countries added to database!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedCountries();