module.exports.config = {
  name: "autoreact",
  version: "1.1.2",
  hasPermission: 0,
  credits: "CYBER-BOT",
  description: "Bot React with extended emoji list",
  commandCategory: "No Prefix",
  cooldowns: 0,
};

module.exports.handleEvent = async ({ api, event }) => {
  const threadData = global.data.threadData.get(event.threadID) || {};
  
  if (threadData["🥰"] === false) return;

  // Ekhane list-ti bariye deya hoyeche
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
  api.sendMessage(`Auto React is now ${status}`, threadID, messageID);
};
