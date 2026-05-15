const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "actions",
  version: "2.1.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Slap, Kiss, Hug, Pat, Bonk collection (No Server Error)",
  commandCategory: "Fun",
  usages: "/[command] @mention",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, mentions }) {
  const { threadID, messageID, body } = event;
  const cmd = body.split(" ")[0].slice(1).toLowerCase();

  // Valid commands list
  const validActions = ["slap", "kiss", "hug", "pat", "bonk"];
  if (!validActions.includes(cmd)) return;

  if (Object.keys(mentions).length == 0) {
    return api.sendMessage(`Kake ${cmd} korben mention din! 🐸`, threadID, messageID);
  }

  const path = __dirname + `/cache/${cmd}_${Date.now()}.gif`;
  
  // Multiple API Servers to avoid "Server Busy"
  const urls = [
    `https://api.waifu.pics/sfw/${cmd}`,
    `https://nekos.best/api/v2/${cmd}`
  ];

  let success = false;
  for (const url of urls) {
    try {
      const res = await axios.get(url);
      const imgUrl = res.data.url || res.data.results[0].url;
      
      const { data } = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(data));
      success = true;
      break; 
    } catch (e) { continue; }
  }

  if (!success) return api.sendMessage("Server Busy! Doya kore abar chesta korun.", threadID, messageID);

  const name = Object.values(mentions)[0].replace("@", "");
  let msg = "";
  if (cmd == "slap") msg = `Oi ${name}, kheye ja ekta chhor! 👋💥`;
  if (cmd == "kiss") msg = `Ummah! ${name} 💋🙈`;
  if (cmd == "hug") msg = `Aso ${name}, joriye dhori! 🤗❤️`;
  if (cmd == "pat") msg = `Lokkhy sona ${name} (Pat)! 🤚✨`;
  if (cmd == "bonk") msg = `${name}-ke bonk dewa holo! 🔨😂`;

  return api.sendMessage({
    body: msg,
    attachment: fs.createReadStream(path)
  }, threadID, () => {
    if (fs.existsSync(path)) fs.unlinkSync(path);
  }, messageID);
};

module.exports.onLoad = () => {
  const actions = ["slap", "kiss", "hug", "pat", "bonk"];
  actions.forEach(a => {
    if (!global.client.commands.has(a)) global.client.commands.set(a, module.exports);
  });
};
