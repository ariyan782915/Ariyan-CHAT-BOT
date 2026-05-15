module.exports.config = {
  name: "bot",
  version: "1.1.0",
  hasPermission: 2, 
  credits: "Ariyan",
  description: "বট কন্ট্রোল: লিভ, স্টপ এবং স্টার্ট",
  commandCategory: "Admin",
  usages: "stop | leave | start | help",
  cooldowns: 2
};

let isStopped = global.isStopped || {}; 

module.exports.handleEvent = async function ({ api, event }) {
  if (isStopped[event.threadID] && event.body) {
    const msg = event.body.toLowerCase();
    // বট স্টপ থাকা অবস্থায় শুধু /bot start কমান্ড কাজ করবে
    if (!msg.includes("bot start")) return;
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0]?.toLowerCase();

  // ১. হেল্প মেনু
  if (!action || action === "help") {
    const helpText = `=== 🤖 BOT SYSTEM ===\n\n` +
      `➜ /bot leave : গ্রুপ থেকে লিভ নিতে\n` +
      `➜ /bot stop : বট অফ করতে\n` +
      `➜ /bot start : বট অন করতে\n` +
      `➜ /bot help : সাহায্য নিতে`;
    return api.sendMessage(helpText, threadID, messageID);
  }

  // ২. লিভ নেওয়ার সিস্টেম
  if (action === "leave") {
    return api.sendMessage("অ্যাডমিনের আদেশ অনুযায়ী আমি গ্রুপ থেকে বিদায় নিচ্ছি। বাই! 👋", threadID, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    });
  }

  // ৩. স্টপ করার সিস্টেম
  if (action === "stop") {
    isStopped[threadID] = true;
    global.isStopped = isStopped;
    return api.sendMessage("বটের অটো-রিপ্লাই বন্ধ করা হলো। 🤫", threadID, messageID);
  }

  // ৪. স্টার্ট করার সিস্টেম
  if (action === "start") {
    isStopped[threadID] = false;
    global.isStopped = isStopped;
    return api.sendMessage("বট আবার সচল করা হয়েছে! 🔥", threadID, messageID);
  }
};
