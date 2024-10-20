
const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
   city: String,
   temp: Number,
   feels_like: Number,
   condition: String,
   timestamp: Date,  // store the timestamp of data update
});

const DailySummarySchema = new mongoose.Schema({
   city: String,
   date: { type: Date, unique: true },  // Unique per day
   avgTemp: Number,
   maxTemp: Number,
   minTemp: Number,
   dominantCondition: String,
});

const Weather = mongoose.model('Weather', WeatherSchema);
const DailySummary = mongoose.model('DailySummary', DailySummarySchema);

module.exports = { Weather, DailySummary };
