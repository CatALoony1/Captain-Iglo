const Discord = require("discord.js");
const cron = require('node-cron');
require('dotenv').config();
const Bump = require('../models/Bump');
const getTenorGifById = require("../utils/getTenorGifById");

let bumpReminderJob = null;

function startJob(client) {
  if (bumpReminderJob) {
    console.log('BumpReminder-Job is already running.');
    return;
  }
  bumpReminderJob = cron.schedule('*/5 * * * * *', async function () {
    const query = {
      guildId: process.env.GUILD_ID,
    };
    try {
      const bumpEntry = await Bump.findOne(query);
      if (bumpEntry) {
        if (bumpEntry.endTime < Date.now() && bumpEntry.reminded === 'N') {
          let guild = client.guilds.cache.get(process.env.GUILD_ID);
          let role = guild.roles.cache.find(role => role.name === 'Bump-Ping');
          await getTenorGifById("8978495178385937973")
            .then(async (gifUrl) => {
              if (!gifUrl.includes("http")) {
                console.log("ERROR Bump gif");
                return;
              }
              var bump = new Discord.EmbedBuilder()
                .setColor(0x0033cc)
                .setTitle("Es ist Zeit zu bumpen!")
                .setImage(gifUrl);
              var targetChannel = await client.channels.fetch(process.env.BUMP_ID);
              var message = await targetChannel.send({ content: `||${role}||`, embeds: [bump] });
              console.log('Bump reminded');
              bumpEntry.remindedId = message.id;
              bumpEntry.reminded = 'J';
              bumpEntry.save();
            })
            .catch((error) => {
              console.error('ERROR:', error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  console.log('BumpReminder-Job started.');
}

function stopJob() {
  if (bumpReminderJob) {
    bumpReminderJob.stop();
    bumpReminderJob = null;
    console.log('BumpReminder-Job stopped.');
  } else {
    console.log('BumpReminder-Job is not running.');
  }
}

function isRunning() {
  return bumpReminderJob !== null;
}

module.exports = {
  startJob,
  stopJob,
  isRunning
};