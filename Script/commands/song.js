const axios = require("axios");
const fs = require('fs');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "song",
  version: "2.1.0",
  aliases: ["music", "play"],
  credits: "dipto",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube",
  category: "media",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "{pn} [গানের নাম বা ইউটিউব লিঙ্ক]:" + 
          "\n   উদাহরণ (বাংলা): {pn} Ei Mon Tomake Dilam" + 
          "\n   উদাহরণ (হিন্দি): {pn} Kesariya" +
          "\n   উদাহরণ (লিঙ্ক): {pn} https://youtu.be/..."
};

module.exports.run = async ({ api, args, event }) => {
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  let videoID;
  const urlYtb = checkurl.test(args[0]);

  if (urlYtb) {
    const match = args[0].match(checkurl);
    videoID = match ? match[1] : null;
    try {
      const { data: { title, downloadLink } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );
      return api.sendMessage({
        body: `🎶 Title: ${title}`,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, event.threadID, () => { if (fs.existsSync('audio.mp3')) fs.unlinkSync('audio.mp3'); }, event.messageID);
    } catch (err) {
      return api.sendMessage("❌ ডাউনলোড করতে সমস্যা হয়েছে: " + err.message, event.threadID);
    }
  }

  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("গানের নাম বা লিঙ্ক দিন।\nযেমন: /song Kesariya", event.threadID, event.messageID);

  try {
    api.sendMessage(`🔍 "${keyWord}" গানটি খোঁজা হচ্ছে...`, event.threadID, event.messageID);
    const res = await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`);
    const result = res.data.slice(0, 6);

    if (result.length == 0) return api.sendMessage("⭕ কোনো গান পাওয়া যায়নি।", event.threadID);

    let msg = "এখানে আপনার পছন্দের গানগুলো রয়েছে:\n\n";
    let i = 1;
    const thumbnails = [];

    for (const info of result) {
      thumbnails.push(diptoSt(info.thumbnail, `photo_${i}.jpg`));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\n\n`;
    }

    api.sendMessage({
      body: msg + "🎧 গান শুনতে নাম্বারে রিপ্লাই দিন।",
      attachment: await Promise.all(thumbnails)
    }, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        result
      });
    }, event.messageID);
  } catch (err) {
    return api.sendMessage("❌ এরর: " + err.message, event.threadID);
  }
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  const { result, author } = handleReply;
  if (event.senderID != author) return;

  try {
    const choice = parseInt(event.body);
    if (!isNaN(choice) && choice <= result.length && choice > 0) {
      const infoChoice = result[choice - 1];
      api.unsendMessage(handleReply.messageID);
      api.sendMessage("📥 গানটি প্রসেসিং হচ্ছে, দয়া করে অপেক্ষা করুন...", event.threadID);

      const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${infoChoice.id}&format=mp3`);

      await api.sendMessage({
        body: `✅ ডাউনলোড সম্পন্ন!\n• Title: ${title}\n• Quality: ${quality || '128kbps'}`,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, event.threadID, () => { if (fs.existsSync('audio.mp3')) fs.unlinkSync('audio.mp3'); }, event.messageID);
    }
  } catch (error) {
    api.sendMessage("⭕ ফাইল সাইজ অনেক বড় হওয়ায় এটি পাঠানো সম্ভব হচ্ছে না।", event.threadID);
  }
};

async function dipto(url, pathName) {
  const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathName, Buffer.from(response));
  return fs.createReadStream(pathName);
}

async function diptoSt(url, pathName) {
  const response = await axios.get(url, { responseType: "stream" });
  response.data.path = pathName;
  return response.data;
}
