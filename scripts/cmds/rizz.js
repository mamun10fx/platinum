const axios = require('axios');

module.exports = {
 config: {
 name: "rizz",
 version: "1.0",
 author: "hedroxyy",
 shortDescription: "Get a random rizz (pickup line).",
 longDescription: "Fetches a random pickup line from the Rizz API.",
 category: "fun",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ message }) {
 try {
 const apiUrl = 'https://rizzapi.vercel.app/random';
 const response = await axios.get(apiUrl);

 if (response.status === 200 && response.data && response.data.text) {
 message.reply(response.data.text);
 } else {
 message.reply("Failed to fetch a rizz. Please try again later.");
 }
 } catch (error) {
 console.error("Error fetching from Rizz API:", error);
 message.reply("Failed to fetch a rizz. Please try again later.");
 }
 }
};