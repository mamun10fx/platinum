const axios = require('axios');

module.exports = {
	config: {
		name: "say",
		aliases: ["say"],
		version: "1.1",
		author: "hedroxyy",
		countDown: 1,
		role: 0,
		shortDescription: "say something",
		longDescription: "",
		category: "Fun",
		guide: {
			vi: "{pn} text ",
			en: "{pn} text "
		}
	},
	onStart: async function ({ api, message, args, event }) {
		let lng = "en";
		let say;

		if (args.length === 0 && event.type === "message_reply") {
			// User replied to a message with .say
			say = event.messageReply.body;
		} else if (args.length > 0) {
			// User provided text with .say {text}
			if (ln.includes(args[0])) {
				lng = args[0];
				args.shift();
			}
			say = args.join(" ");
		} else {
			// No text provided
			return message.reply("Please provide the text to convert to audio.");
		}

		try {
			let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${encodeURIComponent(say)}`;
			message.reply({
				body: "",
				attachment: await global.utils.getStreamFromURL(url)
			});
		} catch (e) {
			console.log(e);
			message.reply("An error occurred while processing your request.");
		}
	}
};

const ln = [
	"af", "sq", "ar", "ay", "eu", "bn", "bs", "bg", "my", "ca", "km", "ch", "ce",
	"hr", "cs", "da", "dv", "nl", "en", "et", "fi", "fr", "de", "el", "gu", "he",
	"hu", "is", "id", "it", "ja", "jv", "kn", "kr", "ks", "kk", "rw", "kv", "kg",
	"ko", "kj", "ku", "ky", "lo", "la", "lv", "lb", "li", "ln", "lt", "lu", "mk",
	"mg", "ms", "ml", "mt", "gv", "mi", "mr", "mh", "ro", "mn", "na", "nv", "nd",
	"ng", "ne", "se", "no", "nb", "nn", "ii", "oc", "oj", "or", "om", "os", "pi",
	"pa", "ps", "fa", "pl", "pt", "qu", "rm", "rn", "ru", "sm", "sg", "sa", "sc",
	"sr", "sn", "sd", "si", "sk", "sl", "so", "st", "nr", "es", "su", "sw", "ss",
	"sv", "tl", "ty", "tg", "ta", "tt", "te", "th", "bo", "ti", "to", "ts", "tn",
	"tr", "tk", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "fy",
	"wo", "xh", "yi", "yo", "za", "zu", "nɪ"
];