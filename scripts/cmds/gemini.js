
const axios = require('axios');

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    aliases: ["g", "gem"],
    author: "hedroxyy",
    role: 0, 
    category: "Utilities",
    description: "Sends a prompt to the Gemini API and retrieves a response.",
    guide: {
      vi: "Gửi một câu lệnh tới API Gemini và nhận phản hồi.",
      en: "Sends a prompt to the Gemini API and retrieves a response."            
    }
  },

  onStart: async function ({ api, message, event, args, commandName }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    try {
      const response = await axios.get(`https://gemini-j43h.onrender.com/prompt=${encodeURIComponent(prompt)}`);
      const data = response.data;

      if (data.candidates && data.candidates.length > 0) {
        const outputText = data.candidates[0].content.parts[0].text;
        message.reply(outputText, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          } else {
            console.error("Error sending message:", err);
          }
        });
      } else {
        message.reply("No response found.");
      }
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      message.reply("An error occurred while fetching the response.");
    }
  },

  onReply: async function ({ api, message, event, Reply, args }) {
    const prompt = args.join(" ");
    let { author, commandName } = Reply;

    if (event.senderID !== author) return;

    try {
      const response = await axios.get(`https://gemini-j43h.onrender.com/prompt=${encodeURIComponent(prompt)}`);
      const data = response.data;

      if (data.candidates && data.candidates.length > 0) {
        const outputText = data.candidates[0].content.parts[0].text;
        message.reply(outputText, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          } else {
            console.error("Error sending message:", err);
          }
        });
      } else {
        message.reply("No response found.");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      api.sendMessage(`${error.message}`, event.threadID);
    }
  }
};