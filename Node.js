const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/chatbot', async (req, res) => {
    const { command } = req.query;
    try {
        let responseMessage = '';
        
        if (command.toLowerCase().includes('weather')) {
            responseMessage = await getWeather();
        } else {
            responseMessage = `You said: "${command}". I'm here to help!`;
        }
        
        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Error processing command:', error);
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again.' });
    }
});

async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        const data = await response.json();
        if (data.weather) {
            return `The weather in Kathmandu is ${data.main.temp} degrees Celsius with ${data.weather[0].description}.`;
        } else {
            return 'I could not retrieve the weather information.';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'There was an error fetching the weather data.';
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
