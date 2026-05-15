module.exports.config = {
  name: "voice",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "Emoji dile cute meyer voice pathabe 😍",
  commandCategory: "no prefix",
  usages: "😘, 🥰, 😍, etc.",
  cooldowns: 0
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiAudioMap = {
  "🥱": "https://files.catbox.moe/9pou40.mp3",
  "😁": "https://files.catbox.moe/60cwcg.mp3",
  "😌": "https://files.catbox.moe/epqwbx.mp3",
  "🥺": "https://files.catbox.moe/wc17iq.mp3",
  "🤭": "https://files.catbox.moe/cu0mpy.mp3",
  "😅": "https://files.catbox.moe/jl3pzb.mp3",
  "😏": "https://files.catbox.moe/z9e52r.mp3",
  "😞": "https://files.catbox.moe/tdimtx.mp3",
  "🤫": "https://files.catbox.moe/0uii99.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3",
  "🐸": "https://files.catbox.moe/utl83s.mp3"
  // Proyojon hole baki link gulo ekhane add kore niben
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const emoji = body.trim();
  const audioUrl = emojiAudioMap[emoji];
  if (!audioUrl) return;

  const cachePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);

  try {
    // Cache folder na thakle create korbe
    if (!fs.existsSync(path.join(__dirname, 'cache'))) {
      fs.mkdirSync(path.join(__dirname, 'cache'));
    }

    const res = await axios.get(audioUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(cachePath, Buffer.from(res.data, "utf-8"));

    return api.sendMessage({
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (error) {
    console.error(error);
  }
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage("Eti ekta no-prefix module. Shudhu emoji dilei kaj korbe!", event.threadID);
};
