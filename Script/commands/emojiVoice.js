module.exports.config = {
  name: "voice",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "Emoji dile cute meyer voice pathabe 😍",
  commandCategory: "no prefix",
  usages: "emoji list boro kora hoyeche",
  cooldowns: 0
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiAudioMap = {
  // Existing list
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
  "🐸": "https://files.catbox.moe/utl83s.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "😱": "https://files.catbox.moe/mu0kka.mp3",
  "🥀": "https://files.catbox.moe/6yanv3.mp3",

  // Notun add kora voice links
  "💖": "https://files.catbox.moe/dv9why.mp3", 
  "🍭": "https://files.catbox.moe/p6ht91.mp3",
  "🤡": "https://files.catbox.moe/utl83s.mp3",
  "😡": "https://files.catbox.moe/shxwj1.mp3",
  "🙈": "https://files.catbox.moe/3qc90y.mp3",
  "😻": "https://files.catbox.moe/y8ul2j.mp3",
  "😾": "https://files.catbox.moe/tqxemm.mp3",
  "😇": "https://files.catbox.moe/8m8p1k.mp3",
  "😋": "https://files.catbox.moe/8m8p1k.mp3",
  "🤪": "https://files.catbox.moe/2sweut.mp3",
  "🥳": "https://files.catbox.moe/qjfk1b.mp3",
  "🤧": "https://files.catbox.moe/shxwj1.mp3",
  "🤨": "https://files.catbox.moe/4aci0r.mp3",
  "🤐": "https://files.catbox.moe/0uii99.mp3"
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const emoji = body.trim();
  const audioUrl = emojiAudioMap[emoji];
  if (!audioUrl) return;

  const cachePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);

  try {
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
    console.error("Audio Load Error:", error);
  }
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("No-Prefix set kora ache. Shudhu emoji pathalei voice chole asbe!", event.threadID);
};
