  const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "actions",
  version: "3.5.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Slap, Kiss, Hug, Pat, Bonk (No API - No Server Busy Error)",
  commandCategory: "Fun",
  usages: "/[command] @mention",
  cooldowns: 1
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, body, mentions } = event;
  const cmd = body.split(" ")[0].slice(1).toLowerCase();

  // বৈধ কমান্ডের লিস্ট
  const validActions = ["slap", "kiss", "hug", "pat", "bonk"];
  if (!validActions.includes(cmd)) return;

  // মেনশন চেক
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(`কাকে ${cmd} করবেন তাকে মেনশন দিন! 👋`, threadID, messageID);
  }

  const path = __dirname + `/cache/${cmd}_${Date.now()}.gif`;
  
  // ডিরেক্ট হাই-কোয়ালিটি এবং লাইটওয়েট Giphy GIF লিংক (যা কখনো ডাউন হবে না)
  let imgUrl = "";
  if (cmd == "slap") imgUrl = "https://media.giphy.com/media/Gf3AUz3eKjVmjVXPMv/giphy.gif";
  if (cmd == "kiss") imgUrl = "https://media.giphy.com/media/l2YWhbSMFpS9s4HhC/giphy.gif";
  if (cmd == "hug") imgUrl = "https://media.giphy.com/media/l41YkxvOObxKqnSzC/giphy.gif";
  if (cmd == "pat") imgUrl = "https://media.giphy.com/media/3o7TKoWXm3okO1kgdW/giphy.gif";
  if (cmd == "bonk") imgUrl = "https://media.giphy.com/media/30lxTuJuefXatghM1V/giphy.gif";

  try {
    const { data } = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(data));

    const idTarget = Object.keys(mentions)[0];
    const name = mentions[idTarget].replace("@", "");
    
    let msg = "";
    if (cmd == "slap") msg = `ঐ ${name}, খেয়ে যা একটা চড়! 👋💥`;
    if (cmd == "kiss") msg = `উম্মাহ! ${name} 💋🙈`;
    if (cmd == "hug") msg = `আসো ${name}, জড়িয়ে ধরি! 🤗❤️`;
    if (cmd == "pat") msg = `লক্ষ্মী সোনা ${name} (Pat)! 🤚✨`;
    if (cmd == "bonk") msg = `${name}-কে মাথায় একটা বোনক (Bonk) দেওয়া হলো! 🔨😂`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }, messageID);

  } catch (e) {
    return api.sendMessage(`❌ দুঃখিত বস, ${cmd} ফাইলটি প্রসেস করা যাচ্ছে না।`, threadID, messageID);
  }
};

module.exports.onLoad = () => {
  const actions = ["slap", "kiss", "hug", "pat", "bonk"];
  actions.forEach(a => {
    if (!global.client.commands.has(a)) global.client.commands.set(a, module.exports);
  });
};
