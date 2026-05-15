const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0, // 0 mane shobai use korte parbe
  credits: "Ariyan",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  // Ekhane apnar chobi gular direct link boshaben
  const images = [
    "https://i.imgur.com/vH6Z83v.jpg", 
    "https://i.imgur.com/someOtherImage.jpg"
  ];

  const info = `
╔═════════════════════ ✿
║ ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
╠═════════════════════ ✿
║ 👑 𝗡𝗮𝗺𝗲 : Ariyan Ahmed Samir
║ 🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : Ariyan
║ 🎂 𝗔𝗴𝗲 : 𝟭𝟴+
║ 💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗻𝗴𝗹𝗲
║ 🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
║ 📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : 𝗛𝗦𝗖
║ 🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : Meherpur
╠═════════════════════ ✿
║ 🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
╠═════════════════════ ✿
║ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
║ https://www.facebook.com/share/1ToNyuuj3x/
╚═════════════════════ ✿
`;

  const randomImg = images[Math.floor(Math.random() * images.length)];
  const path = __dirname + "/cache/owner.jpg";

  const callback = () => api.sendMessage(
    {
      body: info,
      attachment: fs.createReadStream(path)
    },
    event.threadID,
    () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    },
    event.messageID
  );

  return request(encodeURI(randomImg))
    .pipe(fs.createWriteStream(path))
    .on("close", () => callback());
};
