module.exports = {
 config: {
 name: "changegcname",
 version: "1.0",
 aliases: ["cgn"],
 author: "YourName",
 shortDescription: "Change the name of the group chat.",
 longDescription: "Changes the name of the group chat to the specified name.",
 category: "admin",
 guide: {
 en: "{pn} {new_name}"
 },
 role: 2 // Ensure only admins can use this command
 },

 onStart: async function ({ api, event, args }) {
 const newName = args.join(' ');
 if (!newName) {
 return api.sendMessage("Please provide a new name for the group chat.", event.threadID, event.messageID);
 }

 try {
 await api.setTitle(newName, event.threadID);
 api.sendMessage(`✅ | Successfully Changed`, event.threadID, event.messageID);
 } catch (error) {
 console.error("❌ | Failed To Change ");
 api.sendMessage(`❌ | Failed To Change`, event.threadID, event.messageID);
 }
 }
};