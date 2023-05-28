require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

const dinosaurs = require('./dinosaurs.json');
const endings = require('./endings.json');

const usedNicknames = new Set();

const generateNickname = () => {
  let nickname = '';
  do {
    const dinosaur = dinosaurs[Math.floor(Math.random() * dinosaurs.length)];
    const endingKey = Object.keys(endings).find(key => dinosaur.endsWith(key));
    const ending = endings[endingKey] || 'dongus';  // Use 'dongus' as default if no match found
    nickname = dinosaur.replace(endingKey, ending);
  } while (usedNicknames.has(nickname))
  usedNicknames.add(nickname);
  return nickname;
};

client.on('guildMemberAdd', member => {
  const nickname = generateNickname();
  member.setNickname(nickname)
    .catch(console.error);
});

client.login(process.env.BOT_TOKEN);
