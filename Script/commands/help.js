module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "বটের সব কমান্ডের লিস্ট এবং ওনার ইনফো",
  commandCategory: "System",
  usages: "/help [command name]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  // ১. মেইন হেল্প লিস্ট (যখন কেউ শুধু /help লিখবে)
  if (!args[0]) {
    let msg = "===== 🤖 BOT COMMANDS =====\n\n";
    let categories = {};

    // সব কমান্ডগুলোকে সাজানো হচ্ছে
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
    msg += `👤 OWNER: Ariyan\n`;
    msg += `📌 Prefix: /\n`;
    msg += `💡 Total Commands: ${commands.size}\n`;
    msg += `━━━━━━━━━━━━━\n`;
    msg += `📝 বিস্তারিত জানতে লিখুন: /help [কমান্ডের নাম]\n`;
    msg += `👋 বটের সাথে কথা বলতে লিখুন: /bot [আপনার কথা]`;

    return api.sendMessage(msg, threadID, messageID);
  }

  // ২. নির্দিষ্ট কোনো কমান্ড সম্পর্কে জানতে (যেমন: /help song)
  const command = commands.get(args[0].toLowerCase());
  if (command) {
    const { config } = command;
    const detail = `=== 💡 INFO: ${config.name.toUpperCase()} ===\n\n` +
      `➜ বর্ণনা: ${config.description}\n` +
      `➜ ক্যাটাগরি: ${config.commandCategory}\n` +
      `➜ ব্যবহার: /${config.name} ${config.usages || ""}\n` +
      `➜ কুলডাউন: ${config.cooldowns}s\n` +
      `➜ ক্রেডিট: ${config.credits}`;
    
    return api.sendMessage(detail, threadID, messageID);
  } else {
    return api.sendMessage(`❌ "${args[0]}" নামে কোনো কমান্ড খুঁজে পাওয়া যায়নি!`, threadID, messageID);
  }
};
