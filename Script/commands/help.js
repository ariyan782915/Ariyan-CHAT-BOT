const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "1.0.5",
  hasPermission: 0,
  credits: "Ariyan",
  description: "বটের সব কমান্ডের লিস্ট এবং এনিমে পিকচার",
  commandCategory: "System",
  usages: "/help [কমান্ডের নাম]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  try {
    // এনিমে পিকচার বা এনিমেশন এপিআই (রিল্যাক্সড বা কুল লুকের জন্য)
    const animeRes = await axios.get("https://api.waifu.pics/sfw/waifu");
    const animeImg = animeRes.data.url;

    // ১. যদি শুধু /help লিখে
    if (!args[0]) {
      let msg = "===== 🤖 COMMAND LIST =====\n\n";
      let categories = {};

      commands.forEach((cmd, name) => {
        const category = cmd.config.commandCategory || "General";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      });

      for (const category in categories) {
        msg += `🔹 [ ${category.toUpperCase()} ]\n`;
        msg += `➜ ${categories[category].join(", ")}\n\n`;
      }

      msg += `━━━━━━━━━━━━━\n💡 মোট কমান্ড: ${commands.size}\n📝 বিস্তারিত জানতে: /help [নাম]\n📌 Prefix: /`;

      return api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(animeImg)
      }, threadID, messageID);
    }

    // ২. নির্দিষ্ট কমান্ডের তথ্য
    const command = commands.get(args[0].toLowerCase());
    if (command) {
      const { config } = command;
      const detailMsg = `=== 💡 COMMAND INFO ===\n\n` +
        `➜ নাম: ${config.name}\n` +
        `➜ বর্ণনা: ${config.description}\n` +
        `➜ ক্যাটাগরি: ${config.commandCategory}\n` +
        `➜ ব্যবহার: /${config.name} ${config.usages || ""}\n` +
        `➜ কুলডাউন: ${config.cooldowns}s`;

      return api.sendMessage({
        body: detailMsg,
        attachment: await global.utils.getStreamFromURL(animeImg)
      }, threadID, messageID);
    } else {
      return api.sendMessage(`❌ "${args[0]}" নামে কোনো কমান্ড নেই!`, threadID, messageID);
    }

  } catch (err) {
    // এপিআই কাজ না করলে শুধু টেক্সট পাঠাবে
    return api.sendMessage("Help list loading...", threadID, messageID);
  }
};
