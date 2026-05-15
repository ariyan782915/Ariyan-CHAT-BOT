const axios = require("axios");
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "4.1.0",
  aliases: ["music", "play"],
  credits: "Ariyan",
  countDown: 5,
  hasPermssion: 0,
  description: "Download music with original speed (Fix 1.5x speed issue)",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "/song [Ganer nam]"
};

module.exports.run = async ({ api, args, event }) => {
  const { threadID, messageID } = event;
  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("❌ গানের নাম দিন। যেমন: /song tumi amar", threadID, messageID);

  try {
    api.sendMessage(`🔍 "${keyWord}" গানটি খোঁজা হচ্ছে, দয়া করে অপেক্ষা করুন...`, threadID, messageID);

    // ১. ইউটিউব সার্চ (স্টাবল এপিআই)
    const searchRes = await axios.get(`https://jishun1-api.onrender.com/ytsearch?query=${encodeURIComponent(keyWord)}`);
    const video = searchRes.data.data[0];
    
    if (!video) return api.sendMessage("⭕ কোনো গান পাওয়া যায়নি!", threadID, messageID);
    
    const videoURL = video.url;
    const title = video.title;

    // ২. অরিজিনাল স্পিড নিশ্চিত করার জন্য নতুন ডাউনলোড এপিআই
    const dlURL = `https://jishun1-api.onrender.com/ytdl?url=${encodeURIComponent(videoURL)}`;
    const path = __dirname + `/cache/music_${Date.now()}.mp3`;

    // ৩. ফাইল ডাউনলোড এবং সেভ
    const response = await axios.get(dlURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    // ফাইল সাইজ চেক (মেসেঞ্জারে ২৫ এমবি এর বেশি পাঠানো যায় না)
    const stats = fs.statSync(path);
    if (stats.size > 26214400) {
      fs.unlinkSync(path);
      return api.sendMessage("⭕ দুঃখিত, ফাইলটি অনেক বড় (25MB+)। অন্য কোনো গান চেষ্টা করুন।", threadID, messageID);
    }

    // ৪. অরিজিনাল স্পিডে অডিও পাঠানো
    await api.sendMessage({
      body: `✅ ডাউনলোড সম্পন্ন!\n🎶 গান: ${title}\n⏱️ সময়: ${video.duration}\n\nসাউন্ড এখন অরিজিনাল স্পিডে কাজ করবে।`,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ সার্ভার সমস্যার কারণে গানটি পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।", threadID, messageID);
  }
};
