const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "বটের সাথে কথা বলুন এবং যেকোনো প্রশ্নের উত্তর নিন",
  commandCategory: "AI",
  usages: "/bot [আপনার প্রশ্ন বা কথা]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (!content) return api.sendMessage("জি বস, আমি আপনার জন্য কী করতে পারি? যেকোনো প্রশ্ন করতে পারেন। 🤖", threadID, messageID);

  try {
    // এখানে একটি শক্তিশালী AI API ব্যবহার করা হয়েছে যা সব প্রশ্নের উত্তর দিতে পারে
    const res = await axios.get(`https://api.diptoit.com/api/ai/chat?prompt=${encodeURIComponent(content)}`);
    const reply = res.data.response || res.data.reply;

    if (!reply) throw new Error("No response from AI");

    return api.sendMessage(reply, threadID, messageID);

  } catch (err) {
    // যদি মেইন AI বিজি থাকে তবে ব্যাকআপ হিসেবে সিমসিমি ব্যবহার করবে
    try {
        const simRes = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(content)}&lc=bn`);
        return api.sendMessage(simRes.data.success, threadID, messageID);
    } catch (e) {
        return api.sendMessage("দুঃখিত বস, আমার মগজ এখন একটু জ্যাম হয়ে আছে। পরে আবার চেষ্টা করুন! 🧠💨", threadID, messageID);
    }
  }
};
