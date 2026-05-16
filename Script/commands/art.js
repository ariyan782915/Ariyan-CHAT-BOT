const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "art",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Ariyan",
  description: "AI দিয়ে যেকোনো অবাস্তব বা কাল্পনিক ছবি আর্ট করুন (Text to Image)",
  commandCategory: "AI Tools",
  usages: "/art [যা তৈরি করতে চান তার বিবরণ]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  // ইউজার যদি কোনো বিবরণ না দেয়
  if (!prompt) {
    return api.sendMessage(
      "❌ বস, আপনি কী আর্ট করতে চান তা লিখে প্রম্পট দিন!\n\nযেমন: /art a beautiful futuristic city cyberpunk style",
      threadID,
      messageID
    );
  }

  const cacheDir = __dirname + "/cache";
  const path = cacheDir + `/art_${Date.now()}.png`;

  // ক্যাশ ফোল্ডার না থাকলে তৈরি করবে
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  // লোডিং মেসেজ
  const wait = await api.sendMessage(
    `⏳ একটু অপেক্ষা করুন বস, AI আপনার কল্পনার ছবি " ${prompt} " আর্ট করছে... 🎨`,
    threadID,
    messageID
  );

  try {
    // প্রিমিয়াম ও হাই-কোয়ালিটি ফ্রি ইমেজ জেনারেশন API (Pollinations AI)
    const apiUrl = `https://image.pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data));

    // ছবি তৈরি হয়ে গেলে লোডিং মেসেজটি ডিলিট করবে
    api.unsendMessage(wait.messageID);

    return api.sendMessage(
      {
        body: `🎨 আপনার কাল্পনিক আর্ট রেডি বস!\n\n💡 প্রম্পট: ${prompt}\n👑 Owner: Ariyan`,
        attachment: fs.createReadStream(path)
      },
      threadID,
      () => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      },
      messageID
    );

  } catch (e) {
    // কোনো ভুল হলে লোডিং মেসেজ ডিলিট করবে এবং এরর দেখাবে
    api.unsendMessage(wait.messageID);
    console.error(e);
    return api.sendMessage(
      "❌ দুঃখিত বস, ছবি আর্ট করার সার্ভারটি এই মুহূর্তে ব্যস্ত আছে। দয়া করে একটু পরে আবার চেষ্টা করুন।",
      threadID,
      messageID
    );
  }
};
