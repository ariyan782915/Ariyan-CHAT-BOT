    const axios = require("axios");
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "3.1.0",
  aliases: ["music", "play"],
  credits: "Ariyan / dipto",
  countDown: 5,
  hasPermssion: 0,
  description: "Download high quality audio from YouTube",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "{pn} [গানের নাম]"
};

module.exports.run = async ({ api, args, event }) => {
  const { threadID, messageID } = event;
  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("❌ গানের নাম বা ইউটিউব লিঙ্ক দিন।", threadID, messageID);

  try {
    api.sendMessage(`🔍 "${keyWord}" গানটি খোঁজা হচ্ছে...`, threadID, messageID);

    // ১. ইউটিউব সার্চ করে ভিডিওর লিঙ্ক বের করা
    const searchRes = await axios.get(`https://api.diptoit.com/yt/search?query=${encodeURIComponent(keyWord)}`);
    if (!searchRes.data || !searchRes.data.results[0]) {
       return api.sendMessage("⭕ কোনো গান পাওয়া যায়নি!", threadID, messageID);
    }
    
    const video = searchRes.data.results[0];
    const videoURL = video.url;
    const title = video.title;

    api.sendMessage(`📥 ডাউনলোড শুরু হয়েছে: ${title}\nঅপেক্ষা করুন...`, threadID, messageID);

    // ২. ডাউনলোড লিঙ্ক সংগ্রহ (সাউন্ড স্পিড ফিক্স করার জন্য নতুন এপিআই)
    const dlRes = await axios.get(`https://api.diptoit.com/yt/download?url=${videoURL}&type=mp3`);
    const downloadLink = dlRes.data.download_url;

    if (!downloadLink) throw new Error("লিঙ্ক জেনারেট করা সম্ভব হয়নি।");

    // ৩. অডিও ফাইল ডাউনলোড ও সেন্ড করা
    const path = __dirname + `/cache/${Date.now()}.mp3`;
    const response = await axios.get(downloadLink, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    await api.sendMessage({
      body: `✅ ডাউনলোড সম্পন্ন!\n🎶 গান: ${title}`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ সার্ভার সমস্যার কারণে গানটি পাঠানো যায়নি। আবার চেষ্টা করুন।", threadID, messageID);
  }
};
