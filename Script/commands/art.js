module.exports.config = {
  name: "art",
  version: "1.1.0",
  hasPermssion: 0, // '0' mane shobai use korte parbe
  credits: "Ariyan",
  description: "Chhobi ke AI art ba anime style-e rupantor korun",
  commandCategory: "editing",
  usages: "Chhobite reply diye 'art' likhun",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const FormData = require('form-data');
  const path = __dirname + `/cache/artify_${event.senderID}.jpg`;

  const { messageReply, threadID, messageID } = event;

  // Image reply check
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("❌ Please reply to a photo/image.", threadID, messageID);
  }

  api.sendMessage("⏳ Processing your image... please wait.", threadID, messageID);

  try {
    const url = messageReply.attachments[0].url;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

    const form = new FormData();
    form.append("image", fs.createReadStream(path));

    // AI Art API call
    const apiRes = await axios.post(
      "https://art-api-97wn.onrender.com/artify?style=anime",
      form,
      { 
        headers: {
          ...form.getHeaders()
        }, 
        responseType: "arraybuffer" 
      }
    );

    // AI result save
    fs.writeFileSync(path, apiRes.data);

    return api.sendMessage({
        body: "✅ AI Artify Success!",
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }, messageID);

  } catch (err) {
    console.error(err);
    if (fs.existsSync(path)) fs.unlinkSync(path);
    return api.sendMessage("❌ API offline ba image load hote somoshya hoyeche. Abar chesta korun.", threadID, messageID);
  }
};
