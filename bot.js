const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const token = 'Discord Bot Token (Cant use it here)';

const weatherstackApiKey = 'Weather Api Key here';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Weather Bot is online!');
});
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith('!weather')) {
        const cityName = message.content.split(' ').slice(1).join(' ');
        if (!cityName) {
            message.reply('Please provide a city name.');
            return;
        }

        // Build the Weatherstack API URL
        const weatherUrl = `http://api.weatherstack.com/current?access_key=${weatherstackApiKey}&query=${encodeURIComponent(cityName)}`;

        try {
            const response = await axios.get(weatherUrl);
            const data = response.data;
            if (data.error) {
                message.reply(data.error.info);
                return;
            }
            const temp = data.current.temperature;
            const weatherDescription = data.current.weather_descriptions[0];
            const city = data.location.name;
            const country = data.location.country;
            message.reply(`The weather in ${city}, ${country} is ${temp}°C with ${weatherDescription}.`);
        } catch (error) {
            console.error(error);
            message.reply('There was an error retrieving the weather data.');
        }
    }
});
client.login(token);
