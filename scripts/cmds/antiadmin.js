const fs = require('fs');

module.exports = {
  config: {
    name: "antiadmin",
    version: "1.4",
    author: "Hedroxyy",
    countDown: 5,
    role: 1,
    shortDescription: "Restore admin and remove others",
    longDescription: "Automatically restores your admin rights and removes all other admins if someone removes you from the admin role.",
    category: "box",
    guide: "",
  },

  onStart: async function ({ message }) {
    message.reply("Anti-admin module is active and monitoring your admin status.");
  },

  onEvent: async function ({ api, event }) {
    const currentUserID = api.getCurrentUserID();
    const ownerID = "61559819588542";

    if (!event.logMessageData || event.logMessageType !== "log:thread-admins") {
      return;
    }

    const { ADMIN_EVENT, TARGET_ID } = event.logMessageData;

    if (ADMIN_EVENT === "remove_admin" && TARGET_ID === ownerID) {
      try {
        await api.changeAdminStatus(event.threadID, ownerID, true);
        const threadInfo = await api.getThreadInfo(event.threadID);
        const admins = threadInfo.adminIDs.map((admin) => admin.id);

        for (const adminID of admins) {
          if (adminID !== ownerID && adminID !== currentUserID) {
            await api.changeAdminStatus(event.threadID, adminID, false);
          }
        }
      } catch (err) {
        console.error("Error while restoring admin status and removing others:", err);
      }
    }
  },
};