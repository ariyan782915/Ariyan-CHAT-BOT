const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "4k",
    version: "2.0.0",
    hasPermission: 0, // বানান ঠিক করা হয়েছে
    credits: "Ariyan", 
    description: "AI দিয়ে যেকোনো সাধারণ ছবিকে একদম ক্লিয়ার এবং 4K কোয়ালিটি করুন",
    commandCategory: "Image Editing Tools",
    usages: "ছবির রিপ্লাইয়ে লিখে পাঠান 4k",
    cooldowns: 5
  },

  handleEvent: async ({ api, event }) => {
    const { body, messageReply, threadID, messageID } = event;
    if (body?.toLowerCase().trim() === "4k") {
      if (!messageReply?.attachments?.length || messageReply.attachments[0].type !== "photo")
        return api.sendMessage("📸 বস, ছবি রেসপন্স করতে হবে! যেকোনো ছবির রিপ্লাইয়ে '4k' লিখুন।", threadID, messageID);

      await processImage(api, threadID, messageID, messageReply);
    }
  },

  run: async ({ api, event }) => {
    const { threadID, messageID, messageReply } = event;
    if (!messageReply?.attachments?.length || messageReply.attachments[0].type !== "photo")
      return api.sendMessage("📸 যেকোনো ছবির রিপ্লাইয়ে '4k' লিখে কমান্ডটি ব্যবহার করুন!", threadID, messageID);

    await processImage(api, threadID, messageID, messageReply);
  }
};

async function processImage(api, threadID, messageID, messageReply) {
  const cacheDir = __dirname + "/cache";
  const tempPath = cacheDir + `/4k_${Date.now()}.png`;
  const imgUrl = messageReply.attachments[0].url;

  // ক্যাশ ফোল্ডার না থাকলে তৈরি করবে
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // লোডিং মেসেজ
  const wait = await api.sendMessage("⏳ একটু অপেক্ষা করুন বস, আপনার ছবিটিকে AI দিয়ে 4K আল্ট্রা এইচডি করা হচ্ছে...", threadID, messageID);

  try {
    // নতুন এবং ১০০% ওয়ার্কিং ৪কে এনহ্যান্সার এপিআই
    const enhanceUrl = `https://api.canvas-api.site/api/upscale?url=${encodeURIComponent(imgUrl)}`;
    
    const response = await axios.get(enhanceUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(tempPath, Buffer.from(response.data));

    // লোডিং মেসেজটি ডিলিট করা
    api.unsendMessage(wait.messageID);

    return api.sendMessage({
      body: "✔️ 4K Enhance Successful! আপনার এইচডি ছবি রেডি বস।",
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }, messageID);

  } catch (e) {
    // কোনো কারণে সমস্যা হলে লোডিং মেসেজ ডিলিট করবে
    api.unsendMessage(wait.messageID);
    return api.sendMessage("❌ দুঃখিত বস, সার্ভার সমস্যার কারণে এই মুহূর্তে ছবিটি এনহ্যান্স করা যায়নি। আবার চেষ্টা করুন।", threadID, messageID);
  }
}
