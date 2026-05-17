module.exports.config = {
  name: "bonk",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "কাউকে বোনক বা মাথায় বাড়ি দেওয়ার অ্যানিমেশন মিম",
  commandCategory: "general",
  usages: "bonk [Tag someone you want to bonk]",
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
  
  if (!args.join("")) return out("কাকে বোনক মারতে চান, তাকে মেনশন করুন!");
  
  try {
    // waifu.pics এপিআই থেকে ডেটা নেওয়া
    const res = await axios.get('https://api.waifu.pics/sfw/bonk');
    let getURL = res.data.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");    
    
    const path = __dirname + `/cache/bonk.${ext}`;
    
    // ইমেজ/জিআইএফটি বাফার হিসেবে ডাউনলোড করা (যা সার্ভার ক্র্যাশ করা রোধ করে)
    const imageBuffer = await axios.get(getURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(imageBuffer.data, 'utf-8'));
    
    // রিয়্যাকশন দেওয়া
    api.setMessageReaction("🔨", event.messageID, (err) => {}, true);
    
    // মেসেজ পাঠানো
    return api.sendMessage({
      body: `ঐ ${tag}, আরিয়ান তোর মাথায় কষে একটা বোনক মারলো! 🔨💥\n\nবেশি ছাবলামি করলে পিটায়া সোজা করে দিব 😾`,
      mentions: [{
        tag: tag,
        id: mention
      }],
      attachment: fs.createReadStream(path)
    }, event.threadID, () => {
      // মেসেজ যাওয়ার সাথে সাথে ক্যাশ ফাইল ডিলিট করা
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, event.messageID);

  } catch (err) {
    console.log(err);
    api.sendMessage("API বা সার্ভার থেকে ইমেজ জেনারেট করতে সমস্যা হচ্ছে! আবার চেষ্টা করুন।", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
  }     
}
