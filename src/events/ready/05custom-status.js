const { ActivityType } = require('discord.js');
let status = [
  {
    name: 'Eigenwerbung',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=ZIo-ChHy4iU',
  },
  {
    name: 'Fisch',
    type: ActivityType.Watching,
  },
  {
    name: 'dir',
    type: ActivityType.Listening,
  },
  {
    name: 'alleine',
    type: ActivityType.Playing,
  },
  {
    name: 'Ahoi Brause',
    type: ActivityType.Custom,
  },
  {
    name: 'Der Kraken greift an',
    type: ActivityType.Custom,
    state: '🐙'
  },
  {
    name: 'Schiffe versenken',
    type: ActivityType.Competing,
  },
];

module.exports = (client) => {
  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
};