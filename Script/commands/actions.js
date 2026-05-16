const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "actions",
  version: "5.0.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Slap, Kiss, Hug, Pat, Bonk প্রোফাইল পিকচার মিম (ফেলসেফ ব্যাকআপ সিস্টেমসহ)",
  commandCategory: "Fun",
  usages: "/[command] @mention",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, body, mentions, senderID } = event;
  const cmd = body.split(" ")[0].slice(1).toLowerCase();

  const validActions = ["slap", "kiss", "hug", "pat", "bonk"];
  if (!validActions.includes(cmd)) return;

  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(`কাকে ${cmd} করবেন তাকে মেনশন দিন! 👋`, threadID, messageID);
  }

  const idTarget = Object.keys(mentions)[0];
  const name = mentions[idTarget].replace("@", "");
  
  const cacheDir = __dirname + "/cache";
  const path = cacheDir + `/${cmd}_${Date.now()}.jpg`;
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  // ফেসবুক গ্রাফ এপিআই দিয়ে হাই-কোয়ালিটি প্রোফাইল পিকচার লিংক
  const avatarSender = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatarTarget = `https://graph.facebook.com/${idTarget}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  // টেক্সট মেসেজ
  let msg = "";
  if (cmd == "slap") msg = `ঐ ${name}, খেয়ে যা একটা চড়! 👋💥`;
  if (cmd == "kiss") msg = `উম্মাহ! ${name} 💋🙈`;
  if (cmd == "hug") msg = `আসো ${name}, জড়িয়ে ধরি! 🤗❤️`;
  if (cmd == "pat") msg = `লক্ষ্মী সোনা ${name} (Pat)! 🤚✨`;
  if (cmd == "bonk") msg = `${name}-কে মাথায় একটা বোনক (Bonk) দেওয়া হলো! 🔨😂`;

  const wait = await api.sendMessage(`⏳ একটু অপেক্ষা করুন বস, ছবি তৈরি হচ্ছে...`, threadID, messageID);

  // সার্ভার ১: ক্যানভাস মিম জেনারেটর এপিআই
  const canvasServers = [
    `https://api.canvas-api.site/api/${cmd}?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`,
    `https://api.samirapi.tech/canvas/${cmd}?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`
  ];

  // সার্ভার ২: ব্যাকআপ ডিরেক্ট অ্যানিমেটেড/স্ট্যাটিক ইমেজ লিংক (যদি মিম এপিআই একদম কাজ না করে)
  const backupImages = {
    slap: "https://i.postimg.cc/mD8g76b9/slap.jpg",
    kiss: "https://i.postimg.cc/kg7vH67p/kiss.jpg",
    hug: "https://i.postimg.cc/vH8pM7XG/hug.jpg",
    pat: "https://i.postimg.cc/85zXpccG/pat.jpg",
    bonk: "https://i.postimg.cc/BvNfNfC4/bonk.jpg"
  };

  let success = false;

  // প্রথমে প্রোফাইল পিকচার মিম সার্ভারগুলো ট্রাই করবে
  for (let i = 0; i < canvasServers.length; i++) {
    try {
      const response = await axios.get(canvasServers[i], { responseType: "arraybuffer", timeout: 10000 });
      fs.writeFileSync(path, Buffer.from(response.data));
      success = true;
      break;
    } catch (e) {
      console.log(`Canvas server ${i+1} failed, trying next...`);
    }
  }

  // যদি ক্যানভাস এপিআই এর সব সার্ভার ডাউন থাকে, তাহলে ব্যাকআপ ডিরেক্ট মিম ইমেজ লোড করবে
  if (!success) {
    try {
      const backupResponse = await axios.get(backupImages[cmd], { responseType: "arraybuffer", timeout: 10000 });
      fs.writeFileSync(path, Buffer.from(backupResponse.data));
      success = true;
      msg = `⚠️ (সার্ভার ডাউন, ব্যাকআপ ইমেজ পাঠানো হলো)\n\n` + msg;
    } catch (err) {
      console.log("Backup image load failed too.");
    }
  }

  api.unsendMessage(wait.messageID);

  if (success) {
    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);
  } else {
    return api.sendMessage(`❌ দুঃখিত বস, ফেসবুক সার্ভার বা এপিআই কোনোটিই রেসপন্স করছে না। একটু পর আবার চেষ্টা করুন।`, threadID, messageID);
  }
};

module.exports.onLoad = () => {
  const actions = ["slap", "kiss", "hug", "pat", "bonk"];
  actions.forEach(a => {
    if (!global.client.commands.has(a)) global.client.commands.set(a, module.exports);
  });
};
