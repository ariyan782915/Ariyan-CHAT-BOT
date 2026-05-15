const axios = require("axios");
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "5.0.0",
  aliases: ["music", "play"],
  credits: "Ariyan",
  countDown: 5,
  hasPermssion: 0,
  description: "Direct song download with original speed",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "/song [Ganer nam]"
};

module.exports.run = async ({ api, args, event }) => {
  const { threadID, messageID } = event;
  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("❌ Ganer nam din. Udaharon: /song tumi amar", threadID, messageID);

  try {
    api.sendMessage(`🔍 "${keyWord}" khoja hochhe...`, threadID, messageID);

    // 1. Search and Get Video ID
    const searchUrl = `https://api.diptoit.com/yt/search?query=${encodeURIComponent(keyWord)}`;
    const searchRes = await axios.get(searchUrl);
    
    if (!searchRes.data || !searchRes.data.results || searchRes.data.results.length === 0) {
      return api.sendMessage("⭕ Kono gan pawa jayni!", threadID, messageID);
    }
    
    const video = searchRes.data.results[0];
    const videoID = video.id;
    const title = video.title;

    api.sendMessage(`📥 Processing: ${title}\nOriginal speed check hochhe...`, threadID, messageID);

    // 2. Direct Download Link (New Stable Server)
    const dlUrl = `https://api.diptoit.com/yt/download?url=https://www.youtube.com/watch?v=${videoID}&type=mp3`;
    const dlRes = await axios.get(dlUrl);
    const audioLink = dlRes.data.download_url;

    if (!audioLink) throw new Error("Link not found");

    // 3. Download to Buffer and Send
    const path = __dirname + `/cache/song_${Date.now()}.mp3`;
    const response = await axios.get(audioLink, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    // File size safety
    const stats = fs.statSync(path);
    if (stats.size > 26214400) {
      fs.unlinkSync(path);
      return api.sendMessage("⭕ File size 25MB er boro, tai pathano gelo na.", threadID, messageID);
    }

    await api.sendMessage({
      body: `✅ Download Somponno!\n🎶 Title: ${title}\n🎧 Speed: Original (1x)`,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Server Busy! Doya kore arekbar chesta korun.", threadID, messageID);
  }
};
