const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "actions",
  version: "1.5.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "Slap, Bonk, Kiss, Hug, Pat, Cuddle কমান্ডের কালেকশন",
  commandCategory: "Fun",
  usages: "/[command] @mention",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;
  
  // কোন কমান্ডটি ব্যবহার করা হয়েছে তা বের করা (যেমন: /slap লিখলে 'slap' আসবে)
  const commandName = event.body.split(" ")[0].slice(1).toLowerCase();

  // বৈধ কমান্ডের লিস্ট
  const validActions = ["slap", "bonk", "kiss", "hug", "pat", "cuddle"];
  if (!validActions.includes(commandName)) return;

  if (Object.keys(mentions).length == 0) {
    return api.sendMessage(`বস, কাকে ${commandName} করবেন তাকে মেনশন দিন! 🐸`, threadID, messageID);
  }

  try {
    const res = await axios.get(`https://api.waifu.pics/sfw/${commandName}`);
    const imgUrl = res.data.url;

    const mentionName = Object.values(mentions)[0].replace("@", "");
    const path = __dirname + `/cache/${commandName}.gif`;

    const { data } = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(data));

    // কমান্ড অনুযায়ী আলাদা আলাদা মেসেজ
    let msg = "";
    if (commandName === "slap") msg = `ঐ ${mentionName}, খেয়ে যা একটা চড়! 👋💥`;
    if (commandName === "bonk") msg = `${mentionName}-কে একটা শক্ত বোনক (Bonk) দেওয়া হলো! 🔨😂`;
    if (commandName === "kiss") msg = `উম্মাহ! ${mentionName}-কে একটা মিষ্টি কিস দেওয়া হলো! 💋🙈`;
    if (commandName === "hug") msg = `আসো ${mentionName}, তোমাকে একটা জাদু কি ঝাপ্পি (Hug) দেই! 🤗❤️`;
    if (commandName === "pat") msg = `লক্ষ্মী সোনা ${mentionName}, মাথা চাপড়ে দিলাম (Pat)! 🤚✨`;
    if (commandName === "cuddle") msg = `${mentionName}-কে আদরের সাথে জড়িয়ে ধরলাম! 🥰🧸`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (err) {
    return api.sendMessage(`সার্ভার বিজি, এখন ${commandName} দেওয়া যাচ্ছে না! 🙄`, threadID, messageID);
  }
};

// এই অংশটি নিশ্চিত করবে যে সব কমান্ড আলাদাভাবে কাজ করবে
module.exports.onLoad = () => {
    const actions = ["slap", "bonk", "kiss", "hug", "pat", "cuddle"];
    actions.forEach(action => {
        if (!global.client.commands.has(action)) {
            global.client.commands.set(action, module.exports);
        }
    });
};
