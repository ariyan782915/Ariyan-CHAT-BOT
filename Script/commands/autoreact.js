module.exports.config = {
  name: "autoreact",
  version: "1.1.3",
  hasPermission: 0,
  credits: "CYBER-BOT",
  description: "Bot Reacts randomly to some messages",
  commandCategory: "No Prefix",
  cooldowns: 0,
};

module.exports.handleEvent = async ({ api, event }) => {
  const threadData = global.data.threadData.get(event.threadID) || {};
  
  if (threadData["🥰"] === false) return;

  // এখানে Probability সেট করা হয়েছে (০.২ মানে ২০% সম্ভাবনা)
  // সব মেসেজে রিঅ্যাক্ট না দিয়ে এটি র‍্যান্ডমলি রিঅ্যাক্ট দিবে
  if (Math.random() > 0.2) return; 

  const emojis = ["❤️", "💖", "🔥", "✨", "🥰", "😍", "🤩", "🥀", "🌸", "🦋", "😆", "😎", "💯", "🤞", "🥂", "🎈", "👻", "⚡", "🌈", "🍭"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  api.setMessageReaction(randomEmoji, event.messageID, (err) => {
    if (err) console.error("Error sending reaction:", err);
  }, true);
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID } = event;
  let threadData = await Threads.getData(threadID);

  if (typeof threadData.data["🥰"] === "undefined") {
    threadData.data["🥰"] = true; 
  } else {
    threadData.data["🥰"] = !threadData.data["🥰"];
  }

  await Threads.setData(threadID, { data: threadData.data });
  global.data.threadData.set(threadID, threadData.data);

  const status = threadData.data["🥰"] ? "ON" : "OFF";
  api.sendMessage(`Auto React is now ${status} (Random Mode)`, threadID, messageID);
};
