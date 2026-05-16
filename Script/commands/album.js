
conconst axios = require("axios");
const path = require("path");
const fs = require("fs");

const baseApiUrl = async () => {
 const base = await axios.get(
 "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
 );
 return base.data.api;
};

module.exports.config = {
 name: "album",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Dipto Modified By Ariyan + Ariyan Fix",
 description: "Displays album options for selection.",
 usePrefix: true,
 prefix: true,
 category: "Media",
 commandCategory: "Media",
 usages: "[cartoon/photo/lofi/sad/islamic/funny/anime/aesthetic/cat/lyrics/love/sigma/mlbb]",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {

 if (!args[0]) {

 const albumOptions = [
 "Funny video",
 "Islamic video",
 "Sad video",
 "Anime video",
 "Cartoon video",
 "LoFi video",
 "Couple Video",
 "Flower Video",
 "Random Photo",
 "Aesthetic Video",
 "Sigma Rule",
 "Lyrics Video",
 "Cat Video",
 "MLBB Video",
 "Free Fire Video",
 "Football Video",
 "Girl Video",
 "Friends Video",
 "Cricket Video"
 ];

 const message =
 "╔══════════════╗\n" +
 "🎵 ALBUM VIDEO LIST 🎵\n" +
 "╠══════════════╣\n" +
 "01. Funny Video\n" +
 "02. Islamic Video\n" +
 "03. Sad Video\n" +
 "04. Anime Video\n" +
 "05. Cartoon Video\n" +
 "06. LoFi Video\n" +
 "07. Couple Video\n" +
 "08. Flower Video\n" +
 "09. Random Photo\n" +
 "10. Aesthetic Video\n" +
 "11. Sigma Video\n" +
 "12. Lyrics Video\n" +
 "13. Cat Video\n" +
 "14. MLBB Video\n" +
 "15. Free Fire Video\n" +
 "16. Football Video\n" +
 "17. Girl Video\n" +
 "18. Friends Video\n" +
 "19. Cricket Video\n" +
 "╚══════════════╝\n\n" +
 "Reply with a number";

 return api.sendMessage(
 {
 body: message
 },
 event.threadID,
 (err, info) => {

 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 link: albumOptions
 });

 },
 event.messageID
 );

 }

 const d1 = args[0].toLowerCase();

 const validCommands = [
 "cartoon",
 "photo",
 "lofi",
 "sad",
 "islamic",
 "funny",
 "anime",
 "love",
 "lyrics",
 "sigma",
 "aesthetic",
 "cat",
 "flower",
 "ff",
 "mlbb",
 "football",
 "girl",
 "friend",
 "cricket"
 ];

 if (!validCommands.includes(d1)) return;

 if (!event.messageReply || !event.messageReply.attachments) return;

 const attachment = event.messageReply.attachments[0].url;

 const queryMap = {
 cartoon:"addVideo",
 photo:"addPhoto",
 lofi:"addLofi",
 sad:"addSad",
 funny:"addFunny",
 islamic:"addIslamic",
 anime:"addAnime",
 love:"addLove",
 lyrics:"addLyrics",
 flower:"addFlower",
 sigma:"addSigma",
 aesthetic:"addAesthetic",
 cat:"addCat",
 ff:"addFf",
 mlbb:"addMlbb",
 football:"addFootball",
 girl:"addGirl",
 friend:"addFriend",
 cricket:"addCricket"
 };

 try {

 const response=await axios.get(
`${await baseApiUrl()}/drive?url=${encodeURIComponent(attachment)}`
 );

 const fileUrl=response.data.fileUrl;

 const saveRes=await axios.get(
`${await baseApiUrl()}/album?add=${queryMap[d1]}&url=${fileUrl}`
 );

 api.sendMessage(
`✅ ${saveRes.data.data}`,
event.threadID,
event.messageID
 );

 }
 catch(e){

 api.sendMessage(
`Error:\n${e.message}`,
event.threadID,
event.messageID
 );

 }

};

module.exports.handleReply = async function ({
 api,
 event
}) {

 const reply=parseInt(event.body);

 if(isNaN(reply)||reply<1||reply>19){

 return api.sendMessage(
"Reply between 1-19",
event.threadID
 );

 }

 const queryMap={

1:["funny","Funny Video 🤣"],
2:["islamic","Islamic Video 🌙"],
3:["sad","Sad Video 💔"],
4:["anime","Anime Video 🎎"],
5:["cartoon","Cartoon Video 🐱"],
6:["lofi","LoFi Video 🎧"],
7:["love","Couple Video ❤️"],
8:["flower","Flower Video 🌸"],
9:["photo","Random Photo 🖼️"],
10:["aesthetic","Aesthetic Video 🌌"],
11:["sigma","Sigma Video 😎"],
12:["lyrics","Lyrics Video 🎶"],
13:["cat","Cat Video 🐱"],
14:["mlbb","MLBB Video 🎮"],
15:["ff","Free Fire Video 🔥"],
16:["football","Football Video ⚽"],
17:["girl","Girl Video 👧"],
18:["friend","Friends Video 🤝"],
19:["cricket","Cricket Video 🏏"]

};

const [query,caption]=queryMap[reply];

try{

const res=await axios.get(
`${await baseApiUrl()}/album?type=${query}`
);

const mediaUrl=res.data.data;

const media=await axios.get(
mediaUrl,
{
responseType:"arraybuffer"
}
);

const file=path.join(
__dirname,
`cache/${Date.now()}.mp4`
);

fs.writeFileSync(
file,
Buffer.from(media.data)
);

api.sendMessage(
{
body:caption,
attachment:fs.createReadStream(file)
},
event.threadID,
()=>{
fs.unlinkSync(file);
}
);

}
catch(e){

api.sendMessage(
`Error:\n${e.message}`,
event.threadID
);

}

};
