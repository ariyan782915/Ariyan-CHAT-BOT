const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "actions",
  version: "4.0.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Slap, Kiss, Hug, Pat, Bonk ব্যবহারকারীর প্রোফাইল পিকচার দিয়ে মিম বানাবে",
  commandCategory: "Fun",
  usages: "/[command] @mention",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, body, mentions, senderID } = event;
  const cmd = body.split(" ")[0].slice(1).toLowerCase();

  // বৈধ কমান্ডের লিস্ট
  const validActions = ["slap", "kiss", "hug", "pat", "bonk"];
  if (!validActions.includes(cmd)) return;

  // মেনশন চেক
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(`কাকে ${cmd} করবেন তাকে মেশন দিন! 👋`, threadID, messageID);
  }

  const idTarget = Object.keys(mentions)[0];
  const name = mentions[idTarget].replace("@", "");
  
  // প্রোফাইল পিকচার লিঙ্ক (বট ইউজার এবং টার্গেট ইউজার)
  const avatarSender = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatarTarget = `https://graph.facebook.com/${idTarget}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  const path = __dirname + `/cache/${cmd}_${Date.now()}.png`;
  
  // কাস্টম ইমেজ জেনারেটর API লিঙ্ক
  let imgUrl = "";
  if (cmd == "slap") imgUrl = `https://api.canvas-api.site/api/slap?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`;
  if (cmd == "kiss") imgUrl = `https://api.canvas-api.site/api/kiss?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`;
  if (cmd == "hug") imgUrl = `https://api.canvas-api.site/api/hug?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`;
  if (cmd == "pat") imgUrl = `https://api.canvas-api.site/api/pat?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`;
  if (cmd == "bonk") imgUrl = `https://api.canvas-api.site/api/bonk?avatar1=${encodeURIComponent(avatarSender)}&avatar2=${encodeURIComponent(avatarTarget)}`;

  // টেক্সট মেসেজ সাজানো
  let msg = "";
  if (cmd == "slap") msg = `ঐ ${name}, খেয়ে যা একটা চড়! 👋💥`;
  if (cmd == "kiss") msg = `উম্মাহ! ${name} 💋🙈`;
  if (cmd == "hug") msg = `আসো ${name}, জড়িয়ে ধরি! 🤗❤️`;
  if (cmd == "pat") msg = `লক্ষ্মী সোনা ${name} (Pat)! 🤚✨`;
  if (cmd == "bonk") msg = `${name}-কে মাথায় একটা বোনক (Bonk) দেওয়া হলো! 🔨😂`;

  // লোডিং মেসেজ (ইউজার যেন বোঝে কাজ হচ্ছে)
  api.sendMessage(`⏳ একটু অপেক্ষা করুন বস, ছবি তৈরি হচ্ছে...`, threadID, async (err, info) => {
    try {
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data));

      // আগের লোডিং মেসেজটি ডিলিট করা
      if (!err && info) api.unsendMessage(info.messageID);

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }, messageID);

    } catch (e) {
      if (!err && info) api.unsendMessage(info.messageID);
      return api.sendMessage(`❌ দুঃখিত বস, ছবি তৈরি করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।`, threadID, messageID);
    }
  }, messageID);
};

module.exports.onLoad = () => {
  const actions = ["slap", "kiss", "hug", "pat", "bonk"];
  actions.forEach(a => {
    if (!global.client.commands.has(a)) global.client.commands.set(a, module.exports);
  });
};
