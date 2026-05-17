module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "কাউকে থাপ্পড় মারার অ্যানিমেশন মিম",
  commandCategory: "general",
  usages: "slap [Tag someone you want to slap]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require("fs-extra");
  
  var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  
  if (!args.join("")) return out("কাকে থাপ্পড় মারতে চান, তাকে মেনশন করুন!");
  
  try {
    // waifu.pics এপিআই থেকে থাপ্পড়ের ডেটা নেওয়া
    const res = await axios.get('https://api.waifu.pics/sfw/slap');
    let getURL = res.data.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");    
    
    const path = __dirname + `/cache/slap.${ext}`;
    
    // ইমেজ বা জিআইএফ ডাউনলোডের আধুনিক ও নিরাপদ পদ্ধতি
    const imageBuffer = await axios.get(getURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(imageBuffer.data, 'utf-8'));
    
    // রিয়্যাকশন দেওয়া
    api.setMessageReaction("👊", event.messageID, (err) => {}, true);
    
    // মেসেজ পাঠানো
    return api.sendMessage({
      body: `ঐ ${tag}, আরিয়ান তোর গালে কষে একটা থাপ্পড় মারলো! 👋💥\n\nবেশি ছাবলামি করলে থাপ্পড় মেরে গাল লাল করে দিব 😾`,
      mentions: [{
        tag: tag,
        id: mention
      }],
      attachment: fs.createReadStream(path)
    }, event.threadID, () => {
      // ক্যাশ মেমোরি ক্লিয়ার রাখা যেন সার্ভার ডাউন না হয়
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, event.messageID);

  } catch (err) {
    console.log(err);
    api.sendMessage("API বা সার্ভার থেকে ইমেজ জেনারেট করতে সমস্যা হচ্ছে! আবার চেষ্টা করুন।", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
  }     
}
