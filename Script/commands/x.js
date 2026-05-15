module.exports.config = {
  name: "mlbb_chat",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "Mobile Legends funny memes and auto-reply",
  commandCategory: "No Prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  const mlMemes = {
    // --- Mobile Legends Specific ---
    "mlbb": "Mobile Legends khelba? Cholo rank push dei! Kon rank tomar? 🔥",
    "fanny": "Fanny player naki? Cable thikmoto marte paro to? 🚠🤣",
    "chou": "Chou er moto freestyle mara shikhso? Naki shudhu recall maro? 😂🔥",
    "feeder": "Ami feeder na re bhai, amar team-e shudhu noob pore! 😫⛏️",
    "rank": "Rank er kotha boilo na bhai, Epic rank theke ber hoite parlam na! 💩💀",
    "noob": "Tui ekta boro noob, age game khelte shikh tarpor kotha ko! 🤫🐸",
    "recall": "Recall mara bondho kor, age game-e mon de! 🤡✨",
    "win streak": "Win streak cholteche? Tahole amareo invite de! 😎📈",
    "lose streak": "Lose streak khaite khaite ami ekhon devdash! 💔📉",
    "alucard": "Alucard niye feed dewa bondho kor please! 🙏😂",
    "savage": "Savage nite nite amar life-e tension chole ashlo, kintu Savage ar hoilo na! 🤣",
    "gusion": "Gusion nilei ki ar pro hoya jay? Fast hand koro age! 🔥",
    "afk": "Afk thaka manush gula keno je game khelte ashe! 😤",

    // --- General Gaming & Memes ---
    "hi": "High-Hello bad de, game-e ay! 😜🫵",
    "ki koros": "Eka eka rank push dicchi, team-e shob noob porse! 😵‍💫",
    "admin": "Admin Ariyan ekhon rank push diteche, disturb korio na! 😂",
    "owner": "Owner Ariyan Ahmed Samir—je shudhu MLBB-te feeder pay! 👤👑",
    "ami pro": "Hmm, pro naki pro-er baccha? Dekha hobe land-e! 😎",
    "bot er baccha": "Ami bot hoileo tor theke valo ML kheli! 🌚⛏️",
    "breakup": "Gf gese valo hoise, ekhon shanti moto rank push de! 🔥🎮",
    "khawa hoise": "Hawa khaitechi, game-e lose streak khaile ar kkhudha thake na! 😋",
    "bal": "Rag koro na jan, cholo ML kheli! 🥰",
    "chup": "Tui chup kor, feeder kothakar! 🤐"
  };

  if (mlMemes[msg]) {
    return api.sendMessage(mlMemes[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("Eti ekta No-Prefix MLBB meme module. Group-e game niye kotha bollei bot reply dibe!", event.threadID);
};
