const express = require('express');
const { fetchWeatherData, calculateDailySummary, setThreshold } = require('../controllers/weatherController');

const router = express.Router();

// Route to trigger weather data fetch
router.get('/fetch-weather', async (req, res) => {
    await fetchWeatherData();
    res.status(200).send('Weather data fetched.');
});

// Route to calculate daily summaries
router.get('/calculate-summary', async (req, res) => {
    await calculateDailySummary();
    res.status(200).send('Daily weather summaries calculated.');
});

// Route to set a temperature threshold for a city
router.post('/set-threshold', (req, res) => {
    const { city, threshold } = req.body;
    setThreshold(city, threshold);
    res.status(200).send(`Threshold set for ${city}.`);
});

module.exports = router;
