module.exports.config = {
  name: "autoreact",
  version: "1.1.4",
  hasPermission: 0,
  credits: "CYBER-BOT",
  description: "Auto React system disabled",
  commandCategory: "No Prefix",
  cooldowns: 0,
};

module.exports.handleEvent = async ({ api, event }) => {
  // অটো রিঅ্যাক্ট পুরোপুরি অফ করে দেওয়া হয়েছে
  return; 
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID } = event;
  let threadData = await Threads.getData(threadID);

  // ডাটাবেজে স্ট্যাটাস অফ করে রাখা
  threadData.data["🥰"] = false;

  await Threads.setData(threadID, { data: threadData.data });
  global.data.threadData.set(threadID, threadData.data);

  api.sendMessage(`Auto React has been permanently DISABLED. ❌`, threadID, messageID);
};
