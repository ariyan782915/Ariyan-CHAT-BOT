const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "1.1.2",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Obito theme help list with fixed image",
  commandCategory: "System",
  usages: "/help [command name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  // Fixed Obito Uchiha Image Link
  const obitoImg = "https://i.pinimg.com/736x/8e/31/54/8e3154868e6128080f5f84d6216447a1.jpg";

  // 1. Shob command list toiri
  let msg = "===== 🎭 OBITO SYSTEM =====\n\n";
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

  msg += `━━━━━━━━━━━━━\n👤 OWNER: Mijan (Ariyan)\n📌 Prefix: /\n💡 Total Commands: ${commands.size}\n━━━━━━━━━━━━━`;

  // 2. Specific command-er detail check
  if (args[0]) {
    const command = commands.get(args[0].toLowerCase());
    if (command) {
      const { config } = command;
      const detail = `=== 💡 INFO: ${config.name.toUpperCase()} ===\n\n` +
        `➜ Description: ${config.description}\n` +
        `➜ Usage: /${config.name} ${config.usages || ""}\n` +
        `➜ Cooldown: ${config.cooldowns}s`;
      
      return api.sendMessage({
        body: detail,
        attachment: await global.utils.getStreamFromURL(obitoImg)
      }, threadID, messageID);
    }
  }

  // 3. Main help message pathano fixed image-er sathe
  try {
    return api.sendMessage({
      body: msg,
      attachment: await global.utils.getStreamFromURL(obitoImg)
    }, threadID, messageID);
  } catch (err) {
    // Jodi kono karone image load na hoy, shudhu text pathabe
    return api.sendMessage(msg, threadID, messageID);
  }
};
