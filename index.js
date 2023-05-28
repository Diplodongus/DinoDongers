require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

const dinosaurs = require('./dinosaurs.json');
const endings = require('./endings.json');

const usedNicknames = new Set();
const confirmationMessages = new Map(); // Stores confirmation messages to users

const generateNickname = () => {
  let nickname = '';
  do {
    const dinosaur = dinosaurs[Math.floor(Math.random() * dinosaurs.length)];
    const endingKey = Object.keys(endings).find(key => dinosaur.endsWith(key));
    const ending = endings[endingKey] || 'dongus';
    nickname = dinosaur.replace(endingKey, ending);
  } while (usedNicknames.has(nickname))
  return nickname;
};

const sendConfirmationMessage = async (member, nickname) => {
  const message = await member.send(`Welcome! Your generated nickname is ${nickname}. Do you accept this nickname?`);
  // React with emojis
  await message.react('✅');
  await message.react('❌');
  // Store this message's ID along with member ID and nickname for later reference
  confirmationMessages.set(message.id, { memberId: member.id, nickname });
}

client.on('guildMemberAdd', member => {
  const nickname = generateNickname();
  sendConfirmationMessage(member, nickname);
});

client.on('messageReactionAdd', async (reaction, user) => {
  // Ignore bot's own reactions
  if(user.bot) return;
  // Check if this is a confirmation message
  if(confirmationMessages.has(reaction.message.id)) {
    const { memberId, nickname } = confirmationMessages.get(reaction.message.id);
    if(memberId !== user.id) return; // Ignore if the reaction is not from the intended member
    if(reaction.emoji.name === '✅') {
      // The member accepted the nickname
      const member = reaction.message.guild.members.cache.get(memberId);
      member.setNickname(nickname);
      user.send(`You have accepted the nickname ${nickname}`);
      confirmationMessages.delete(reaction.message.id);
    } else if(reaction.emoji.name === '❌') {
      // The member rejected the nickname, generate a new one
      const newNickname = generateNickname();
      sendConfirmationMessage(reaction.message.guild.members.cache.get(memberId), newNickname);
      confirmationMessages.delete(reaction.message.id);
    }
  }
});

client.login(process.env.BOT_TOKEN);
