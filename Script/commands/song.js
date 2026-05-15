const axios = require("axios");
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "4.0.0",
  aliases: ["music", "play"],
  credits: "Ariyan",
  countDown: 5,
  hasPermssion: 0,
  description: "Download high quality audio from YouTube with new stable API",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "{pn} [Ganer nam]"
};

module.exports.run = async ({ api, args, event }) => {
  const { threadID, messageID } = event;
  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("❌ Ganer nam ba YouTube link din.", threadID, messageID);

  try {
    api.sendMessage(`🔍 "${keyWord}" gan-ti khoja hochhe...`, threadID, messageID);

    // YouTube Search API
    const searchRes = await axios.get(`https://jishun1-api.onrender.com/ytsearch?query=${encodeURIComponent(keyWord)}`);
    const video = searchRes.data.data[0];
    
    if (!video) return api.sendMessage("⭕ Kono gan pawa jayni!", threadID, messageID);
    
    const videoURL = video.url;
    const title = video.title;

    api.sendMessage(`📥 Download hochhe: ${title}\nDoya kore opekkha korun...`, threadID, messageID);

    // Stable Download API (MP3 Format)
    const dlURL = `https://jishun1-api.onrender.com/ytdl?url=${encodeURIComponent(videoURL)}`;
    const path = __dirname + `/cache/song_${Date.now()}.mp3`;

    const response = await axios.get(dlURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    // File size check (Messenger 25MB limit)
    const stats = fs.statSync(path);
    if (stats.size > 26214400) {
      fs.unlinkSync(path);
      return api.sendMessage("⭕ File size onek boro hoyay Messenger-e pathano shomvob noy.", threadID, messageID);
    }

    await api.sendMessage({
      body: `✅ Download somponno!\n🎶 Gan: ${title}\n⏱️ Somoy: ${video.duration}`,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Ei muhurte server ektu busy. Doya kore arekbar chesta korun ba onno kono ganer nam likhun.", threadID, messageID);
  }
};
