module.exports = {
  config: {
    name: "setbalance",
    aliases: ["setbal"],
    version: "1.0",
    author: "hedroxyy",
    countDown: 5,
    role: 2,
    description: {
      vi: "cập nhật số tiền cho người dùng",
      en: "set the balance for a user"
    },
    category: "economy",
    guide: {
      vi: "{pn} {uid} | {amount}: cập nhật số tiền cho người dùng",
      en: "{pn} {uid} | {amount}: set the balance for a user"
    }
  },

  langs: {
    vi: {
      success: "Đã cập nhật số tiền của người dùng %1 thành %2$",
      invalid: "Cú pháp không hợp lệ. Vui lòng nhập đúng: {pn} {uid} | {amount}"
    },
    en: {
      success: "Successfully set the balance of user %1 to %2$",
      invalid: "Invalid syntax. Please use the correct format: {pn} {uid} | {amount}"
    }
  },

  onStart: async function ({ message, usersData, event, args, getLang }) {
    const [uid, amount] = args.join(" ").split(" | ");
    if (!uid || !amount || isNaN(amount)) {
      return message.reply(getLang("invalid"));
    }
    const parsedAmount = parseInt(amount);
    const userData = await usersData.get(uid);
    if (!userData) {
      return message.reply("User not found or does not have a profile.");
    }
    await usersData.set(uid, {
      money: parsedAmount,
      data: userData.data,
    });
    message.reply(getLang("success", uid, parsedAmount));
  }
};