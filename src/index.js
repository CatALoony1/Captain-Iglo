require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const { CommandHandler } = require('djs-commander');
const path = require('path');

const client = new Discord.Client({
  intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.GuildMessageReactions, Discord.IntentsBitField.Flags.MessageContent, Discord.IntentsBitField.Flags.GuildEmojisAndStickers, Discord.IntentsBitField.Flags.GuildMembers, Discord.IntentsBitField.Flags.GuildModeration, Discord.IntentsBitField.Flags.GuildPresences, Discord.IntentsBitField.Flags.GuildVoiceStates],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
});

new CommandHandler({
  client,
  devUserIds: ['393803995065614343'],
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),

});

client.login(process.env.TOKEN);

/** Delete Commands
const rest = new Discord.REST().setToken(process.env.TOKEN);

rest.put(Discord.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
  .then(() => console.log('Successfully deleted all guild commands.'))
  .catch(console.error);

rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);  */
