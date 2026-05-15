module.exports.config = {
  name: "mlbb_chat",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "Ariyan",
  description: "Mobile Legends pro-noob memes and auto-reply",
  commandCategory: "No Prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  const mlMemes = {
    // --- Pro & Noob Related ---
    "pro": "Nijei nijeরে Pro dabi koros? Age match-e MVP hoye dekha! 😎🔥",
    "noob": "Tui ekta boro noob, tor khelay kono logic nai, shudhu magic (feed) ase! 🤫🐸",
    "legend": "Legend rank-e giye ki boro player hoye gesos? Mythic-e ay tarpor kotha hobe! 🙄✨",
    "mythic": "Mythic-e ascho thik ase, kintu ekhono khelte shikhla na! 🤡📉",
    "master": "Master rank-e thaka manush-der kotha bolar kono odhikar nai! 😂⛏️",
    "epic": "Epic rank-e thaka mane holo akash theke patale pora! Ber hoite parbi na kokhono. 💀💩",
    
    // --- Hero & Gameplay Specific ---
    "fanny": "Fanny player naki? Cable thikmoto marte paro to, naki deale bariya khao? 🚠🤣",
    "chou": "Chou er moto freestyle mara shikhso? Naki shudhu recall maro? 😂🔥",
    "feeder": "Ami feeder na re bhai, amar team-e shudhu noob pore! 😫⛏️",
    "recall": "Recall mara bondho kor, age game-e mon de! 🤡✨",
    "savage": "Savage nite nite amar life-e tension chole ashlo, kintu Savage ar hoilo na! 🤣",
    "alucard": "Alucard niye feed dewa bondho kor please! 🙏😂",
    "lose streak": "Lose streak khaite khaite ami ekhon devdash! 💔📉",
    "win streak": "Win streak cholteche? Tahole amareo invite de! 😎📈",

    // --- General Fun ---
    "mlbb": "Mobile Legends khelba? Cholo rank push dei! 🔥",
    "hi": "High-Hello bad de, game-e ay! 😜🫵",
    "ki koros": "Eka eka rank push dicchi, team-e shob noob porse! 😵‍💫",
    "admin": "Admin Ariyan ekhon rank push diteche, disturb korio na! 😂",
    "owner": "Owner Ariyan Ahmed Samir—je shudhu MLBB-te feeder pay! 👤👑",
    "chup": "Tui chup kor, feeder kothakar! 🤐"
  };

  if (mlMemes[msg]) {
    return api.sendMessage(mlMemes[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("Eti No-Prefix MLBB module. Pro, Noob, Rank niye kotha bollei bot reply dibe!", event.threadID);
};
