const axios = require('axios');
const { Weather, DailySummary } = require('../models/weatherModel');

// Fetch weather data for multiple cities from OpenWeatherMap API
const fetchWeatherData = async () => {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    const apiKey = process.env.OPENWEATHER_API_KEY;

    for (let city of cities) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const data = response.data;

            const weather = new Weather({
                city: data.name,
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                condition: data.weather[0].main,
                timestamp: new Date(data.dt * 1000)
            });
            await weather.save();
            console.log(`Weather data for ${city} saved.`);
        } catch (error) {
            console.error(`Error fetching weather data for ${city}: `, error.message);
        }
    }
};

// Aggregate daily weather data for each city and store the summaries
const calculateDailySummary = async () => {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

    for (let city of cities) {
        const weatherData = await Weather.find({
            city,
            timestamp: { $gte: new Date().setHours(0, 0, 0, 0) } // Data for today
        });

        if (weatherData.length > 0) {
            const avgTemp = weatherData.reduce((acc, data) => acc + data.temp, 0) / weatherData.length;
            const maxTemp = Math.max(...weatherData.map(data => data.temp));
            const minTemp = Math.min(...weatherData.map(data => data.temp));
            const dominantCondition = weatherData.sort((a, b) =>
                weatherData.filter(v => v.condition === a.condition).length -
                weatherData.filter(v => v.condition === b.condition).length
            ).pop().condition;

            const summary = new DailySummary({
                city,
                date: new Date(),
                avgTemp,
                maxTemp,
                minTemp,
                dominantCondition
            });

            await summary.save();
            console.log(`Daily summary for ${city} saved.`);
        }
    }
};

// User-defined thresholds for alerting
let thresholds = {};

// Set threshold for a specific city
const setThreshold = (city, threshold) => {
    thresholds[city] = threshold;
};

// Check if thresholds are breached for each city
const checkThresholds = async () => {
    for (let city in thresholds) {
        const latestData = await Weather.findOne({ city }).sort({ timestamp: -1 });
        if (latestData && latestData.temp > thresholds[city]) {
            console.log(`Alert! ${city}'s temperature exceeds ${thresholds[city]}°C.`);
        }
    }
};

module.exports = { fetchWeatherData, calculateDailySummary, setThreshold, checkThresholds };
