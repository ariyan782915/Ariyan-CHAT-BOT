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
  usages: "{pn} [<song name>|<song link>]:" + "\n   Example:" + "\n{pn} chipi chipi chapa chapa"
};

module.exports.run = async ({ api, args, event }) => {
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  let videoID;
  const urlYtb = checkurl.test(args[0]);

  // ১. যদি সরাসরি ইউটিউব লিঙ্ক দেয়
  if (urlYtb) {
    const match = args[0].match(checkurl);
    videoID = match ? match[1] : null;
    try {
      const { data: { title, downloadLink } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );
      return api.sendMessage({
        body: `Title: ${title}`,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, event.threadID, () => fs.unlinkSync('audio.mp3'), event.messageID);
    } catch (err) {
      return api.sendMessage("❌ Error downloading from link: " + err.message, event.threadID);
    }
  }

  // ২. যদি নাম লিখে সার্চ করে
  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("গানের নাম বা লিঙ্ক দিন।", event.threadID, event.messageID);

  keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
  const maxResults = 6;
  let result;

  try {
    api.sendMessage(`🔍 "${keyWord}" গানটি খোঁজা হচ্ছে...`, event.threadID, event.messageID);
    result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`)).data).slice(0, maxResults);
  } catch (err) {
    return api.sendMessage("❌ An error occurred: " + err.message, event.threadID, event.messageID);
  }

  if (result.length == 0)
    return api.sendMessage("⭕ No search results match the keyword: " + keyWord, event.threadID, event.messageID);

  let msg = "";
  let i = 1;
  const thumbnails = [];

  for (const info of result) {
    thumbnails.push(diptoSt(info.thumbnail, `photo_${i}.jpg`));
    msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
  }

  api.sendMessage({
    body: msg + "Reply to this message with a number to listen",
    attachment: await Promise.all(thumbnails)
  }, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      result
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  const { result, author } = handleReply;
  if (event.senderID != author) return; // যে সার্চ করেছে শুধু সেই রিপ্লাই দিতে পারবে

  try {
    const choice = parseInt(event.body);
    if (!isNaN(choice) && choice <= result.length && choice > 0) {
      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;

      api.unsendMessage(handleReply.messageID);
      api.sendMessage("📥 গানটি ডাউনলোড করা হচ্ছে, দয়া করে অপেক্ষা করুন...", event.threadID);

      const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp3`);

      await api.sendMessage({
        body: `• Title: ${title}\n• Quality: ${quality || 'High'}`,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, event.threadID, () => {
        if (fs.existsSync('audio.mp3')) fs.unlinkSync('audio.mp3');
      }, event.messageID);
    } else {
      api.sendMessage("ভুল সংখ্যা! ১ থেকে ৬ এর মধ্যে একটি নাম্বার দিন।", event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage("⭕ দুঃখিত, ফাইল সাইজ বড় হওয়ায় বা সার্ভার সমস্যার কারণে পাঠানো যায়নি।", event.threadID, event.messageID);
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
