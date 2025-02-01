const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: "prompt",
    aliases: ["describe"],
    version: "1.0",
    author: "yourname",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Describe an image using the image-to-text API"
    },
    longDescription: {
      en: "Reply to an image and get a description by sending it to the image-to-text API."
    },
    category: "tools",
    guide: {
      en: ""
    }
  },

  onStart: async function ({ api, event }) {
    const imgbbApiKey = "1b4d99fa0c3195efe42ceb62670f2a25";
    const linkanh = event.messageReply?.attachments[0]?.url;
    
    if (!linkanh) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(linkanh, { responseType: 'arraybuffer' });
      const formData = new FormData();
      formData.append('image', Buffer.from(response.data, 'binary'), { filename: 'image.png' });
      const res = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: formData.getHeaders(),
        params: {
          key: imgbbApiKey
        }
      });
      const imageLink = res.data.data.url;
      
      const promptApiUrl = `https://imagetotext-gen-api.onrender.com/prompt?imgurl=${encodeURIComponent(imageLink)}`;
      const apiResponse = await axios.get(promptApiUrl);
      
      const description = apiResponse.data;

      if (description.candidates && description.candidates.length > 0) {
        const content = description.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a description.";
        return api.sendMessage(content, event.threadID, event.messageID);
      } else {
        return api.sendMessage("Sorry, no description was generated.", event.threadID, event.messageID);
      }

    } catch (error) {
      console.log(error);
      return api.sendMessage('Failed to upload image to imgbb or generate description.', event.threadID, event.messageID);
    }
  }
};