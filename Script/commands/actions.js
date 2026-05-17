module.exports.config = {
  name: "action",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "বিভিন্ন ধরনের ইন্টারেক্টিভ অ্যাকশন মিম সরাসরি ব্যবহার করুন",
  commandCategory: "fun",
  // এখানে এলিয়াস যোগ করা হয়েছে, যার ফলে এগুলোকে সরাসরি কমান্ড হিসেবে ব্যবহার করা যাবে
  aliases: ["slap", "bonk", "hug", "kiss", "pat"], 
  usages: "[slap / bonk / hug / kiss / pat] @mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args, commandName }) => {
  const axios = require('axios');
  const fs = require("fs-extra");
  
  // ব্যবহারকারী কোন নাম দিয়ে কমান্ড ডেকেছে (যেমন: bonk নাকি slap) তা নির্ধারণ করা
  let actionType = commandName.toLowerCase();
  
  // যদি কেউ ভুলে শুধু /action লেখে, তবে মেইন নাম 'action' আসবে। সেক্ষেত্রে args[0] চেক করবে
  if (actionType === "action") {
    actionType = args[0]?.toLowerCase();
  }
  
  const availableActions = ["slap", "bonk", "hug", "kiss", "pat"];
  
  // সঠিক অ্যাকশন চেক
  if (!actionType || !availableActions.includes(actionType)) {
    return api.sendMessage(
      `❌ দয়া করে একটি সঠিক কমান্ড বেছে নিন!\n\n` +
      `📌 সরাসরি ব্যবহার করার নিয়ম:\n` +
      `• /slap @mention (থাপ্পড় মারা)\n` +
      `• /bonk @mention (মাথায় বাড়ি দেওয়া)\n` +
      `• /hug @mention (জড়িয়ে ধরা)\n` +
      `• /kiss @mention (চুমু দেওয়া)\n` +
      `• /pat @mention (মাথায় হাত বুলানো)`, 
      event.threadID, event.messageID
    );
  }
  
  // মেনশন চেক করা (যাকে মেনশন করা হয়েছে তার আইডি)
  var mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage(`❌ আপনি কাকে ${actionType} করতে চান, তাকে মেনশন করুন!`, event.threadID, event.messageID);
  
  let tag = event.mentions[mention].replace("@", "");    
  
  // প্রতিটি অ্যাকশনের কনফিগ ডাটা
  let configMap = {
    slap: { emoji: "👊", api: "slap", txt: `ঐ ${tag}, আরিয়ান তোর গালে কষে একটা থাপ্পড় মারলো! 👋💥\n\nবেশি ছাবলামি করলে গাল লাল করে দিব 😾` },
    bonk: { emoji: "🔨", api: "bonk", txt: `ঐ ${tag}, আরিয়ান তোর মাথায় কষে একটা বোনক মারলো! 🔨💥\n\nবেশি পাকা পোক্তামি করলে পিটায়া সোজা করে দিব!` },
    hug: { emoji: "❤️", api: "hug", txt: `আহা রে ${tag}! আরিয়ান توকে খুব সুন্দর করে একটা জড়িয়ে ধরলো (Hug)! 🤗✨` },
    kiss: { emoji: "😘", api: "kiss", txt: `উম্মাাা! 😘 ${tag}, আরিয়ান তোকে একটা মায়াবী কিস করলো!` },
    pat: { emoji: "🥰", api: "pat", txt: `সব ঠিক হয়ে যাবে ${tag}! আরিয়ান তোর মাথায় আলতো করে হাত বুলিয়ে দিচ্ছে... 🥰` }
  };

  try {
    // waifu.pics এপিআই থেকে ডাটা নেওয়া
    const res = await axios.get(`https://api.waifu.pics/sfw/${configMap[actionType].api}`);
    let getURL = res.data.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    
    const path = __dirname + `/cache/action_${actionType}.${ext}`;
    
    // ইমেজ/জিআইএফ বাফার ডাউনলোড (সার্ভার ক্র্যাশ প্রুফ)
    const imageBuffer = await axios.get(getURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(imageBuffer.data, 'utf-8'));
    
    // ইমোজি রিয়্যাকশন দেওয়া
    api.setMessageReaction(configMap[actionType].emoji, event.messageID, (err) => {}, true);
    
    // মেসেজ ও মিডিয়া পাঠানো
    return api.sendMessage({
      body: configMap[actionType].txt,
      mentions: [{
        tag: tag,
        id: mention
      }],
      attachment: fs.createReadStream(path)
    }, event.threadID, () => {
      // ফাইল পাঠানোর পরেই ডিলিট করে দেওয়া যেন স্টোরেজ জ্যাম না হয়
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ এপিআই সার্ভার রেসপন্স করছে না। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
  }     
};
