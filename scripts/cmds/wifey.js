const axios = require("axios");

module.exports = {
  config: {
    name: "wifey",
    version: "1.0",
    aliases: [],
    author: "Kshitiz",
    role: 0,
    category: "fun",
    description: "Fetches a random wifey video",
    guide: {
      en: "Usage: .wifey - Fetches a random wifey video",
    },
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      // Add reaction to indicate the bot is processing
      api.setMessageReaction("🕐", messageID, (err) => {}, true);

      // Fetch video data from the API
      const response = await axios.get("https://wifey-evzk.onrender.com/kshitiz", { responseType: "stream" });

      // Send the video as an attachment
      api.sendMessage(
        {
          body: "Here's a random Wifey video for you!",
          attachment: response.data, // Video stream data
        },
        threadID,
        (err) => {
          if (err) {
            console.error("Error sending video:", err);
            api.sendMessage("Sorry, I couldn't send the video. Please try again later.", threadID);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching video:", error);

      // Inform the user of the error
      api.sendMessage("Sorry, there was an error fetching the video. Please try again later.", threadID);
    }
  },
};