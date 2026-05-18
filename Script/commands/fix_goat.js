const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "fix_goat",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Fahim",
  description: "Idol বা Goat লিখলে অটোমেটিক ভিডিও রিপ্লাই করবে (লিঙ্ক ফিক্সড)",
  commandCategory: "fun",
  usages: "গ্রুপে 'idol' অথবা 'goat' লিখুন",
  cooldowns: 1,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // যদি মেসেজে 'idol' অথবা 'goat' থাকে
  if (text === "idol" || text === "goat") {
    
    // 📥 [ফিক্সড] একটি ১০০% ওয়ার্কিং ডিরেক্ট লিঙ্ক বসানো হয়েছে
    const videoUrl = "https://i.imgur.com/uRovGat.mp4"; 

    // ক্যাশ পাথ তৈরি করা (সার্ভার লোড ফিক্স করার জন্য টাইমস্ট্যাম্প দেওয়া হয়েছে)
    const path = __dirname + `/cache/goat_fixed_${senderID}_${Date.now()}.mp4`;

    // লোডিং রিয়্যাকশন দেওয়া
    api.setMessageReaction("🔮", messageID, (err) => {}, true);

    try {
      // ভিডিও বাফার ডাউনলোড করা (সবচেয়ে স্টেবল ডাউনলোড মেথড)
      const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data));

      // সাকসেস রিয়্যাকশন দেওয়া
      api.setMessageReaction("✅", messageID, (err) => {}, true);

      // গ্রুপে ভিডিও পাঠানো
      return api.sendMessage({
        body: `✔️ Here is your IDOL/GOAT video boss! 🔥💎`,
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        // [অত্যন্ত জরুরি] ক্যাশ ফাইল ডিলিট করা
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }, messageID);

    } catch (err) {
      console.error(err);
      
      // এরর হলে রিয়্যাকশন সরিয়ে ফেলবে
      api.setMessageReaction("", messageID, (err) => {}, true);
      
      // বটের এডমিনকে এরর পাঠানো বা শুধু টেক্সট পাঠানো
      return api.sendMessage("❌ বস, ভিডিও ডাউনলোড লিঙ্কে সার্ভার ইস্যু দেখা দিচ্ছে। লিংকটি আবার চেক করুন!", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("💡 এই কমান্ডটি ব্যবহার করতে গ্রুপে সরাসরি 'idol' অথবা 'goat' লিখুন!", event.threadID, event.messageID);
};
