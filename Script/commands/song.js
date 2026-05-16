const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "music",
  version: "3.0.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "কোনো লিস্ট ছাড়া সরাসরি যেকোনো একটি গান অডিও (MP3) হিসেবে ডাউনলোড করুন",
  commandCategory: "Media",
  usages: "/music [গানের নাম]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const songName = args.join(" ");

  if (!songName) {
    return api.sendMessage(
      "❌ বস, আপনি কোন গানটি শুনতে চান তার নাম লিখে সার্চ করুন!\n\nযেমন: /music bondhu tin din tor bari gulam",
      threadID,
      messageID
    );
  }

  const cacheDir = __dirname + "/cache";
  const path = cacheDir + `/music_${Date.now()}.mp3`;

  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  // লোडिंग মেসেজ
  const wait = await api.sendMessage(
    `⏳ একটু অপেক্ষা করুন বস, আপনার পছন্দের গানটি সরাসরি ডাউনলোড করা হচ্ছে... 🎧`,
    threadID,
    messageID
  );

  // ডিরেক্ট সিঙ্গেল ডাউনলোড এপিআই লিস্ট (যা কোনো টেক্সট লিস্ট দেয় না)
  const servers = [
    `https://api.canvas-api.site/api/v1/yt/audio?search=${encodeURIComponent(songName)}`,
    `https://api.samirapi.tech/video/youtube/mp3?query=${encodeURIComponent(songName)}`
  ];

  let success = false;
  let title = songName;

  for (let i = 0; i < servers.length; i++) {
    try {
      const res = await axios.get(servers[i], { timeout: 15000 });
      
      // ডিরেক্ট সিঙ্গেল ডাউনলোড লিঙ্কটি খুঁজে বের করা
      let downloadUrl = res.data?.downloadUrl || res.data?.result?.downloadUrl || res.data?.url || res.data?.result?.link;
      
      if (res.data?.title || res.data?.result?.title) {
        title = res.data?.title || res.data?.result?.title;
      }

      // যদি এপিআই কোনো অবজেক্ট বা টেক্সট লিস্ট দেয়, তবে সেটা স্কিপ করে শুধু ডিরেক্ট লিঙ্ক নিবে
      if (downloadUrl && typeof downloadUrl === "string") {
        const audioResponse = await axios.get(downloadUrl, { 
          responseType: "arraybuffer", 
          timeout: 40000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        if (audioResponse.data.length > 26214400) {
          api.unsendMessage(wait.messageID);
          return api.sendMessage("❌ বস, গানটির সাইজ ২৫ মেগাবাইটের বেশি হওয়ায় পাঠানো যাচ্ছে না।", threadID, messageID);
        }

        fs.writeFileSync(path, Buffer.from(audioResponse.data));
        success = true;
        break;
      }
    } catch (error) {
      continue; 
    }
  }

  // লোডিং মেসেজ ডিলিট করা
  api.unsendMessage(wait.messageID);

  if (success) {
    return api.sendMessage(
      {
        body: `🎵 আপনার গান রেডি বস!\n\n🎼 নাম: ${title}\n👑 Owner: Ariyan`,
        attachment: fs.createReadStream(path)
      },
      threadID,
      () => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      },
      messageID
    );
  } else {
    return api.sendMessage(
      "❌ দুঃখিত বস, গানটি খুঁজে পাওয়া যায়নি অথবা সার্ভার ডাউন। দয়া করে গানের নাম সঠিক বানানে লিখে আবার চেষ্টা করুন।",
      threadID,
      messageID
    );
  }
};
