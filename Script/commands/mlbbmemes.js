module.exports.config = {
  name: "mlbb_bangla_meme",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "MLBB funny Bangla memes with photos",
  commandCategory: "No Prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  // MLBB ফটো মিমস এবং ডায়ালগ লিস্ট
  const mlMemes = {
    "mlbb": {
      msg: "Mobile Legends khelba? Cholo rank push dei! 🔥",
      img: "https://i.imgur.com/vHqY7bK.jpg"
    },
    "fanny": {
      msg: "Fanny-র ক্যাবল মারা দেখে মনে হয় মাকড়সা কামড় দিছে! 🚠🤣",
      img: "https://i.imgur.com/XGfR1A0.jpg"
    },
    "noob": {
      msg: "তোর গেমপ্লে দেখে মনে হচ্ছে বটও তোরে গালি দিবে! 🤫🐸",
      img: "https://i.imgur.com/6U8XWre.jpg"
    },
    "epic": {
      msg: "Epic rank হলো এমন এক নরক যেখান থেকে পালানোর কোনো রাস্তা নেই! 💩💀",
      img: "https://i.imgur.com/GisW6F4.jpg"
    },
    "feeder": {
      msg: "আমি ফিডার না রে ভাই, আমার টিমমেটগুলাই এমন! 😫⛏️",
      img: "https://i.imgur.com/R38wXzJ.jpg"
    },
    "chou": {
      msg: "চৌ এর স্টাইল মারা দেখে মনে হয় সার্কাসে কাজ করে! 😂🔥",
      img: "https://i.imgur.com/4q6I9mU.jpg"
    }
  };

  if (mlMemes[msg]) {
    const data = mlMemes[msg];
    
    // ছবিসহ মেসেজ পাঠানোর সিস্টেম
    return api.sendMessage({
      body: data.msg,
      attachment: await global.utils.getStreamFromURL(data.img)
    }, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("MLBB Photo Meme module active! Group-e key-word likhlei chobi shoho reply ashbe! 📸🔥", event.threadID);
};
