module.exports = {
    config: {
        name: "pastebin",
        aliases: ["adc", "bin"],
        version: "1.2",
        author: "hedroxyy", 
        countDown: 5,
        role: 2,
        shortDescription: {
            vi: "",
            en: "adc command"
        },
        longDescription: {
            vi: "",
            en: "only bot owner"
        },
        category: "Bot account",
        guide: {
            en: "{pn}"
        }
    },
    onStart: async function ({ api, event, args }) {
        const permission = ["61559819588542"];
        if (!permission.includes(event.senderID))
            return api.sendMessage("❌ | You aren't allowed to use this command.", event.threadID, event.messageID);

        const axios = require('axios');
        const fs = require('fs');
        const request = require('request');
        const cheerio = require('cheerio');
        const { join, resolve } = require("path");
        const { senderID, threadID, messageID, messageReply, type } = event;
        var name = args[0];

        if (type == "message_reply") {
            var text = messageReply.body;
        }
        if (!text && !name)
            return api.sendMessage('Please reply to the link you want to apply the code to or write the file name to upload the code to pastebin!', threadID, messageID);

        if (!text && name) {
            var data = fs.readFile(
                `${__dirname}/${args[0]}.js`,
                "utf-8",
                async (err, data) => {
                    if (err) return api.sendMessage(`Command ${args[0]} does not exist!.`, threadID, messageID);

                    // Use your custom pastebin API here
                    const pastebinApiUrl = "https://pastebin-api-myg3.onrender.com/api/paste"; // URL of your hosted API

                    async function createPaste(content, pasteName) {
                        try {
                            const response = await axios.post(pastebinApiUrl, {
                                content: content
                            });

                            const rawUrl = response.data.raw_url;  // Your API will return this field with the raw URL
                            return rawUrl;
                        } catch (error) {
                            console.error("Error creating paste:", error);
                            return null;
                        }
                    }

                    var rawLink = await createPaste(data, args[1] || 'noname');
                    if (rawLink) {
                        return api.sendMessage(rawLink, threadID, messageID);
                    } else {
                        return api.sendMessage("Error creating paste.", threadID, messageID);
                    }
                }
            );
            return;
        }

        var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        var url = text.match(urlR);

        if (url[0].indexOf('pastebin') !== -1) {
            axios.get(url[0]).then(i => {
                var data = i.data
                fs.writeFile(
                    `${__dirname}/${args[0]}.js`,
                    data,
                    "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`An error occurred while applying the code ${args[0]}.js`, threadID, messageID);
                        api.sendMessage(`Applied the code to ${args[0]}.js, use command load to use!`, threadID, messageID);
                    }
                );
            })
        }

        if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
            const options = {
                method: 'GET',
                url: messageReply.body
            };
            request(options, function (error, response, body) {
                if (error) return api.sendMessage('Please only reply to the link (doesn\'t contain anything other than the link)', threadID, messageID);
                const load = cheerio.load(body);
                load('.language-js').each((index, el) => {
                    if (index !== 0) return;
                    var code = el.children[0].data
                    fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                        function (err) {
                            if (err) return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
                            return api.sendMessage(`Added this code "${args[0]}.js", use command load to use!`, threadID, messageID);
                        }
                    );
                });
            });
            return
        }

        if (url[0].indexOf('drive.google') !== -1) {
            var id = url[0].match(/[-\w]{25,}/)
            const path = resolve(__dirname, `${args[0]}.js`);
            try {
                await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
                return api.sendMessage(`Added this code "${args[0]}.js" If there is an error, change the drive file to txt!`, threadID, messageID);
            }
            catch (e) {
                return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
            }
        }
    }
}