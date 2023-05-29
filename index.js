// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
	intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
	],
	partials: ['REACTION', 'MESSAGE', 'CHANNEL'], // Opt into partials
});

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

const sendConfirmationMessage = async (guild, member, nickname) => {
  const channel = guild.channels.cache.get(process.env.CHANNEL_ID); // replace with your channel ID
  const message = await channel.send(`${member.user.tag}'s generated nickname is ${nickname}. Do you accept this nickname?`);
  // React with emojis
  await message.react('✅');
  await message.react('❌');
  // Store this message's ID along with member ID and nickname for later reference
  confirmationMessages.set(message.id, { memberId: member.id, nickname });
}

const sendConfirmedMessage = async (guild, member, nickname) => {
  const channel = guild.channels.cache.get(process.env.CHANNEL_ID); // replace with your channel ID
  const message = await channel.send(`${member.user.tag}'s nickname is now ${nickname}.`);
}

const sendFailedMessage = async (guild, member, nickname) => {
  const channel = guild.channels.cache.get(process.env.CHANNEL_ID); // replace with your channel ID
  const message = await channel.send(`${member.user.tag}'s nickname was supposed to be ${nickname}, but I couldn't change it because their role is higher than mine.`);
}

client.on('guildMemberAdd', member => {
  const nickname = generateNickname();
  sendConfirmationMessage(member.guild, member, nickname);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // Ignore bot's own reactions
  if(user.bot) return;
  // Check if this is a confirmation message
  if(confirmationMessages.has(reaction.message.id)) {
    const { memberId, nickname } = confirmationMessages.get(reaction.message.id);
    if(memberId !== user.id) return; // Ignore if the reaction is not from the intended member
    if(reaction.emoji.name === '✅') {
      // The member accepted the nickname
      const member = reaction.message.guild.members.cache.get(memberId);
      try {
        await member.setNickname(nickname);
        user.send(`You have accepted the nickname ${nickname}`);
        sendConfirmedMessage(reaction.message.guild, member, nickname);
      } catch (error) {
        // Catch the error if the bot can't manage the member's nickname
        user.send(`You accepted the nickname ${nickname}, but I couldn't change it because your role is higher than mine in the server. You can manually change your nickname to ${nickname}.`);
        sendFailedMessage(reaction.message.guild, member, nickname);
      }
    } else if(reaction.emoji.name === '❌') {
      const member = reaction.message.guild.members.cache.get(memberId);
      // The member rejected the nickname, generate a new one
      const newNickname = generateNickname();
      sendConfirmationMessage(member.guild, member, newNickname);
    }
    // Delete the message after the reaction
    reaction.message.delete().catch(console.error);
    confirmationMessages.delete(reaction.message.id);
  }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === 'dinoname') {
    const nickname = generateNickname();
    const member = interaction.guild.members.cache.get(interaction.user.id);
    await sendConfirmationMessage(interaction.guild, member, nickname);
    await interaction.reply(`Your proposed new nickname is ${nickname}. Please confirm in the dedicated channel.`);
  }
});

client.on('ready', async () => {
  const data = {
      name: 'dinoname',
      description: 'Generate a new Dino Donger nickname!',
  };

  // The id of your guild (server)
  const guildId = process.env.GUILD_ID;

  const command = await client.guilds.cache.get(guildId)?.commands.create(data);
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.BOT_TOKEN);