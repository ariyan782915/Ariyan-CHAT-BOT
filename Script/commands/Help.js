const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "1.0.8",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Bot-er shob command ebong owner info dekhun",
  commandCategory: "System",
  usages: "/help [command name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  try {
    // Anime picture API
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    const imgUrl = res.data.url;

    // 1. Shudhu /help likhle shob command list ebong Owner Info ashbe
    if (!args[0]) {
      let msg = "===== 🤖 BOT COMMANDS =====\n\n";
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

      msg += `━━━━━━━━━━━━━\n`;
      msg += `👤 OWNER INFO\n`;
      msg += `➜ Name: Mijan (Ariyan)\n`;
      msg += `➜ Facebook: fb.com/ariyan782915\n`;
      msg += `➜ Status: Active\n`;
      msg += `━━━━━━━━━━━━━\n`;
      msg += `💡 Total Commands: ${commands.size}\n`;
      msg += `📝 Detail janar jonno likhun: /help [command name]\n`;
      msg += `📌 Prefix: /`;

      return api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(imgUrl)
      }, threadID, messageID);
    }

    // 2. Nirdishto command-er details dekhate
    const command = commands.get(args[0].toLowerCase());
    if (command) {
      const { config } = command;
      const detail = `=== 💡 COMMAND INFO ===\n\n` +
        `➜ Name: ${config.name}\n` +
        `➜ Description: ${config.description}\n` +
        `➜ Category: ${config.commandCategory}\n` +
        `➜ Usage: /${config.name} ${config.usages || ""}\n` +
        `➜ Cooldown: ${config.cooldowns}s`;

      return api.sendMessage({
        body: detail,
        attachment: await global.utils.getStreamFromURL(imgUrl)
      }, threadID, messageID);
    } else {
      return api.sendMessage(`❌ "${args[0]}" name-e kono command nei!`, threadID, messageID);
    }

  } catch (err) {
    return api.sendMessage("Help list load hote somoshya hochhe. Doya kore abar chesta korun.", threadID, messageID);
  }
};
