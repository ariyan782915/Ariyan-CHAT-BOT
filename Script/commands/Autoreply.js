const axios = require("axios");

module.exports.config = {
  name: "autoreplybot",
  version: "2.7.0",
  hasPermssion: 0,
  credits: "Ariyan",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  const responses = {
    // --- Greetings & Essentials ---
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "hello": "হ্যাঁ জানু বলো, শুনতেছি তো! 😍",
    "assalamualaikum": "Walaikumassalam ❤️... Ki obostha?",
    "slm": "Walaikumassalam জানু, বলো কি খবর?",
    "bye": "টাটা! সাবধানে যেও কিন্তু। 👋",
    "by": "কিরে তুই কই যাস? একা একা চিপায় যাবি নাকি? 🌚🌶️",
    "thanks": "ধন্যবাদ দিতে হবে না, আরিয়ান বসের ইনবক্সে গিয়ে একটা লাভ রিয়্যাক্ট দিয়ে আসো! 🥰",

    // --- Identity & Owner ---
    "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ Ariyan Ahmed ☜\nFacebook: https://www.facebook.com/share/1ToNyuuj3x/]",
    "admin": "আরিয়ান আহমেদ তাকে সবাই অ্যাডমিন হিসেবেই চিনে! 😘☺️",
    "tui ke": "আমি আরিয়ান বসের তৈরি করা একটি চ্যাটবট। আমার নাম Raika। 😎",
    "tor nam ki": "আমার নাম Raika... আরিয়ান বস এই নামটা রাখছে। ✨",

    // --- Fun & Flirt ---
    "miss you": "আহারে! আমাকে মিস না করে আরিয়ান বসরে মিস করো, কাজে দিবে। 👻😘",
    "i love you": "মেয়ে হলে আমার বস আরিয়ানের ইনবক্সে গিয়ে ডাইরেক্ট প্রপোজ করো! 🫢😻",
    "love you": "ভালোবাসা ভালোবাসা! আরিয়ান বসের আইডিতে গিয়ে ভালোবাসা দেখাও জানু। 😘",
    "kiss me": "উম্মাহ! কিন্তু তুমি তো দাঁত ব্রাশ করো নাই, গন্ধ আসতেছে! 🤭😷",
    "biye korba": "আরিয়ান বসের পারমিশন ছাড়া বিয়া করা নিষেধ! 💍🌚",
    "gf ase": "আমি রোবট মানুষ, আমার আবার জিএফ কিসের? 🙄🔥",

    // --- Daily Conversations ---
    "hmm": "শুধু 'হুম' বললে হবে না, ভালো কিছু বলো জানু! 🥵",
    "ki koros": "বসে বসে তোমার মেসেজের অপেক্ষা করছি! 😏💘",
    "kemon aso": "আলহামদুলিল্লাহ ভালো, তুমি কেমন আছো জানু? 🥰",
    "valo aso": "আমি তো বিন্দাস! তোমার দিনকাল কেমন যাচ্ছে?",
    "khawa hoise": "আমি তো শুধু ইন্টারনেট খাই, তুমি কি দিয়ে ভাত খাইলা? 😋",
    "ki khao": "হাওয়া খাই আর আরিয়ান বসের বকা খাই! 😂",
    "bari koi": "আমি তো আরিয়ান বসের কম্পিউটারে থাকি। 🏠",
    "ki obostha": "এইতো চলছে! তোমার কি খবর বলো?",

    // --- Funny / Angry ---
    "bal": "রাগ করো না সোনা পাখি, শান্ত হও! 🥰",
    "pagol": "হুম আমি পাগল, শুধু তোমার জন্যই তো পাগল! 😏😂",
    "chup": "আমি চুপ করলে তো গ্রুপটা শান্ত হয়ে যাবে, তখন কি ভালো লাগবে? 🤫",
    "bot er baccha": "আমি রোবট, আমার আবার বাচ্চা কোত্থেকে আসবে? 🌚⛏️",
    "bhalo lage na": "ভালো না লাগলে আকাশে গিয়ে তারা গুনো! 😂",
    "রাগ": "জানু রাগ করো না, গালটা কামড়ে দিবো কিন্তু! 🦷🤣",
    "ok": "ওকে জানু, ভালো থেকো! ✋"
  };

  if (responses[msg]) {
    return api.sendMessage(responses[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return this.handleEvent({ api, event });
};
