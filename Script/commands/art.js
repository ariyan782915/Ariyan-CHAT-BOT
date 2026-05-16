module.exports.config = {
  name: "help",
  version: "1.0.5",
  hasPermission: 0,
  credits: "Ariyan",
  description: "বটের সব কমান্ডের লিস্ট এবং ব্যবহার দেখার নিয়ম।",
  commandCategory: "System",
  usages: "/help [কমান্ডের নাম]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botPrefix = global.config.PREFIX || "/";

  // বটের সব কমান্ডের লিস্ট তৈরি করা
  const commands = Array.from(global.client.commands.values());
  
  // ইউজার যদি নির্দিষ্ট কোনো কমান্ডের নিয়ম দেখতে চায় (যেমন: /help art)
  if (args[0]) {
    const commandName = args[0].toLowerCase();
    const command = global.client.commands.get(commandName);

    if (!command) {
      return api.sendMessage(`❌ বস, "${commandName}" নামে কোনো কমান্ড খুঁজে পাওয়া যায়নি! সব কমান্ড দেখতে শুধু "${botPrefix}help" লিখুন।`, threadID, messageID);
    }

    const config = command.config;
    const msg = `👑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 👑\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `📝 নাম: ${config.name}\n` +
                `ℹ️ বিবরণ: ${config.description || "নেই"}\n` +
                `Category: ${config.commandCategory || "Fun"}\n` +
                `🚀 ব্যবহার: ${config.usages || "নেই"}\n` +
                `⏱️ Cooldown: ${config.cooldowns || 1} সেকেন্ড\n` +
                `👤 Credits: ${config.credits || "Unknown"}`;
                
    return api.sendMessage(msg, threadID, messageID);
  }

  // সব কমান্ড ক্যাটাগরি অনুযায়ী সাজানো
  const categories = {};
  commands.forEach(cmd => {
    if (!cmd.config || !cmd.config.name) return;
    const cat = cmd.config.commandCategory || "অন্যান্য";
    if (!categories[cat]) categories[cat] = [];
    if (!categories[cat].includes(cmd.config.name)) {
      categories[cat].push(cmd.config.name);
    }
  });

  let helpMsg = `╭•┄┅═══❁👑❁═══┅┄•╮\n   𝗔𝗿𝗶𝘆𝗮𝗻 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 𝗛𝗲𝗹𝗽\n╰•┄┅═══❁👑❁═══┅┄•╯\n\n`;
  
  for (const category in categories) {
    helpMsg += `🔹 [ ${category.toUpperCase()} ] 🔹\n`;
    helpMsg += `» ${categories[category].join(", ")}\n\n`;
  }

  helpMsg += `━━━━━━━━━━━━━━━━━━\n`;
  helpMsg += `📝 মোট কমান্ড সংখ্যা: ${commands.length} টি\n`;
  helpMsg += `💡 যেকোনো কমান্ডের ব্যবহার জানতে লিখুন: ${botPrefix}help [কমান্ডের নাম]\n`;
  helpMsg += `👑 Owner: Ariyan`;

  return api.sendMessage(helpMsg, threadID, messageID);
};
