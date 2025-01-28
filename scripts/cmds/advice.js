const axios = require("axios");

module.exports = {
  config: {
    name: "advice",
    version: "1.0.0",
    aliases: ["getAdvice"],
    author: "hedroxyy",
    role: 0,
    category: "Utility",
    description: "Fetches a random piece of advice.",
    guide: {
      vi: "Lấy một lời khuyên ngẫu nhiên.",
      en: "Fetches a random piece of advice."
    }
  },

  onStart: async function ({ bot, message, args }) {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      const advice = response.data.slip.advice;
      message.reply(advice);
    } catch (error) {
      message.reply("Sorry, I couldn't fetch advice at the moment.");
    }
  }
};