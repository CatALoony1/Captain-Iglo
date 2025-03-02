const { ActivityType } = require('discord.js');
const cron = require('node-cron');
let status = [
  {
    activities: [{
      name: 'Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=ZIo-ChHy4iU'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'mehr Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=iTMsblGTAdM'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Serverhymne',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=k0jvsZ6HQOM'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Fisch',
      type: ActivityType.Watching
    }], status: 'online',
    afk: false
  },
  {
    activities: [{
      name: 'in die Ferne',
      type: ActivityType.Watching
    }], status: 'online',
    afk: true
  },
  {
    activities: [{
      name: 'dir',
      type: ActivityType.Listening
    }], status: 'invisible'
  },
  {
    activities: [{
      name: 'dem Nixengesang',
      type: ActivityType.Listening
    }], status: 'idle'
  },
  {
    activities: [{
      name: 'Seemannsliedern',
      type: ActivityType.Listening
    }], status: 'online'
  },
  {
    activities: [{
      name: 'alleine',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'das Angelspiel',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Ahoi Brause',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: '🐙',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Sucht das One Piece',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Schiffe versenken',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Fischstäbchen essen',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
];

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = (client) => {
  var i = 0;
  cron.schedule('*/15 * * * * *', async function () { //30sec
    const number = getRandom(0, status.length - 1);
    await client.user.setPresence(status[i]);
    i++;
    if(i == status.length){
      i = 0;
    }
  });
};