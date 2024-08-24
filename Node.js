const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/assistant', async (req, res) => {
    const { command, lang } = req.query;
    let responseMessage = '';

    if (command.toLowerCase().includes('weather')) {
        responseMessage = await getWeather();
    } else {
        responseMessage = getFallbackResponse(command, lang);
    }

    res.json({ message: responseMessage });
});

function getFallbackResponse(command, lang) {
    if (lang === 'ne') {
        return `तपाईंले भने: "${command}". म तपाईंलाई यसमा मद्दत गर्न सक्छु।`;
    }
    return `You said: "${command}". I can help you with that.`;
}

async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        const data = await response.json();
        if (data.weather) {
            return `The weather in Kathmandu is ${data.main.temp} degrees Celsius.`;
        } else {
            return 'I could not retrieve the weather information.';
        }
    } catch (error) {
        return 'There was an error fetching the weather data.';
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
