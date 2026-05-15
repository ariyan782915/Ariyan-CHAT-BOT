const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "1.2.5",
  hasPermission: 0,
  credits: "Ariyan",
  description: "বট এখন সবার সব মেসেজের উত্তর দিবে",
  commandCategory: "AI",
  usages: "[আপনার কথা]",
  cooldowns: 2
};

// এই অংশটি নিশ্চিত করবে যে বট সব মেসেজ রিড করছে
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  const botID = api.getCurrentUserID();

  // বট নিজে নিজেকে রিপ্লাই দিবে না এবং মেসেজ খালি থাকলে কাজ করবে না
  if (!body || senderID == botID) return;

  // আপনি যদি চান শুধু প্রিফিক্স ছাড়া কথা বললে বট উত্তর দিবে, তবে নিচের অংশ কাজ করবে
  if (body.toLowerCase().startsWith("bot") || body.toLowerCase().startsWith("বট")) {
    try {
      const res = await axios.get(`https://api.diptoit.com/api/ai/chat?prompt=${encodeURIComponent(body)}`);
      const reply = res.data.response || res.data.reply;
      return api.sendMessage(reply, threadID, messageID);
    } catch (err) {
      return; // এরর হলে চুপ থাকবে
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (!content) return api.sendMessage("জি বস, আমি আছি! কিছু বলতে চান? 🤖", threadID, messageID);

  try {
    const res = await axios.get(`https://api.diptoit.com/api/ai/chat?prompt=${encodeURIComponent(content)}`);
    const reply = res.data.response || res.data.reply;
    return api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    return api.sendMessage("সার্ভার একটু বিজি আছে বস! 🧠💨", threadID, messageID);
  }
};
