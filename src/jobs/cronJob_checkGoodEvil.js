const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const BotState = require('../models/BotState');

let checkGoodEvilJob = null;

function startJob(client) {
  if (checkGoodEvilJob) {
    console.log('CheckGoodEvil-Job is already running.');
    return;
  }
  checkGoodEvilJob = cron.schedule('5 0 * * *', async function () { // 7 Uhr
    const state = await BotState.findOne({
      guildId: process.env.GUILD_ID,
    });
    if (state) {
      if (state.state != 'neutral') {
        let diffTime = Math.abs(Date.now() - state.startTime);
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const oldState = state.state;
        if (diffDays >= 1) {
          state.state = 'neutral';
          state.startTime = undefined;
        }
        state.save();
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        if (oldState == 'evil') {
          await targetChannel.send(`Ach, ich habe mich wieder etwas beruhigt, diese Wut war echt anstrengend.`);
        } else {
          await targetChannel.send(`Auch die schönste Zeit vergeht mal, schade! :(`);
        }
        await client.user.setAvatar('./img/iglo_neutral.jpg');
      }
    } else {
      console.log(`Botstate entry created`);
      const newBotstate = new BotState({
        guildId: process.env.GUILD_ID,
        evilCount: 0,
        loveCount: 0,
        state: 'neutral'
      });
      await newBotstate.save();
    }
  });
  console.log('CheckGoodEvil-Job started.');
}

function stopJob() {
  if (checkGoodEvilJob) {
    checkGoodEvilJob.stop();
    checkGoodEvilJob = null;
    console.log('CheckGoodEvil-Job stopped.');
  } else {
    console.log('CheckGoodEvil-Job is not running.');
  }
}

function isRunning() {
  return checkGoodEvilJob !== null;
}

module.exports = {
  startJob,
  stopJob,
  isRunning
};

/*
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

  * = jede

*/