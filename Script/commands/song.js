const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "song",
  version: "7.0.0",
  aliases: ["music", "sing"],
  credits: "Ariyan",
  hasPermission: 0,
  description: "SoundCloud থেকে সরাসরি এবং সুপারফাস্ট গান ডাউনলোড করুন",
  commandCategory: "Media",
  usages: "/song [গানের নাম]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const songName = args.join(" ");

  if (!songName) {
    return api.sendMessage("❌ গানের নাম দিন বস! যেমন: /song tumi amar", threadID, messageID);
  }

  try {
    api.sendMessage(`🔍 "${songName}" গানটি ডিরেক্ট সোর্স থেকে খোঁজা হচ্ছে...`, threadID, messageID);

    // SoundCloud Direct Music API
    const res = await axios.get(`https://api.popcat.xyz/soundcloud?q=${encodeURIComponent(songName)}`);
    
    if (!res.data || !res.data.download) {
      return api.sendMessage("⭕ দুঃখিত, এই গানটি খুঁজে পাওয়া যায়নি! দয়া করে অন্য কোনো নাম লিখে ট্রাই করুন।", threadID, messageID);
    }

    const audioUrl = res.data.download;
    const title = res.data.title || "SoundCloud Track";
    const duration = res.data.duration || "Unknown";
    const path = __dirname + `/cache/sc_song_${Date.now()}.mp3`;

    // ডিরেক্ট হাই-স্পিড ডাউনলোড
    const { data } = await axios.get(audioUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(data));

    // ফাইল সাইজ চেক (Max 25MB)
    const stats = fs.statSync(path);
    if (stats.size > 26214400) {
      fs.unlinkSync(path);
      return api.sendMessage("⭕ গানটির সাইজ ২৫ মেগাবাইটের বেশি, তাই পাঠানো গেল না।", threadID, messageID);
    }

    // চ্যাটে গান পাঠানো
    return api.sendMessage({
      body: `✅ সুপারফাস্ট ডাউনলোড সম্পন্ন!\n🎶 গান: ${title}\n⏰ ডিউরেশন: ${duration}\n👤 ওনার: Ariyan`,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);

  } catch (err) {
    return api.sendMessage("❌ ডিরেক্ট মিউজিক সার্ভার এই মুহূর্তে রেসপন্স করছে না। আবার চেষ্টা করুন!", threadID, messageID);
  }
};
