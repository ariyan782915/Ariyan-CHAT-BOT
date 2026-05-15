const axios = require("axios");
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "3.2.0",
  aliases: ["music", "play"],
  credits: "Ariyan",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube with high speed",
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

    // ১. ইউটিউব সার্চ এবং ভিডিওর তথ্য সংগ্রহ
    const searchRes = await axios.get(`https://api-all-1.m-mostakim0978.repl.co/ytFullSearch?songName=${encodeURIComponent(keyWord)}`);
    
    if (!searchRes.data || searchRes.data.length === 0) {
       return api.sendMessage("⭕ কোনো গান পাওয়া যায়নি!", threadID, messageID);
    }
    
    const video = searchRes.data[0]; // প্রথম রেজাল্টটি নেওয়া হলো
    const videoID = video.id;
    const title = video.title;

    api.sendMessage(`📥 ডাউনলোড হচ্ছে: ${title}\nদয়া করে অপেক্ষা করুন...`, threadID, messageID);

    // ২. গান ডাউনলোডের লিঙ্ক সংগ্রহ
    const dlRes = await axios.get(`https://api-all-1.m-mostakim0978.repl.co/ytDl3?link=${videoID}&format=mp3`);
    const downloadLink = dlRes.data.downloadLink;

    if (!downloadLink) throw new Error("Link not found");

    // ৩. অডিও ফাইল ডাউনলোড ও সরাসরি সেন্ড করা
    const path = __dirname + `/cache/song_${Date.now()}.mp3`;
    
    // cache ফোল্ডার না থাকলে তৈরি করে নিবে
    if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");

    const response = await axios.get(downloadLink, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    await api.sendMessage({
      body: `✅ ডাউনলোড সম্পন্ন!\n🎶 গান: ${title}\n👤 আপলোডার: ${video.author || 'YouTube'}\n⏰ সময়: ${video.time}`,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path); // ফাইল পাঠিয়ে ডিলিট করে দিবে
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ সার্ভার অনেক বিজি অথবা ফাইল সাইজ বেশি বড়। অন্য গানের নাম দিয়ে চেষ্টা করুন।", threadID, messageID);
  }
};
