const { MessageFlags } = require('discord.js');
const rolenames = ['Hering Silber',
  'Thunfisch Grau',
  'Ozean-Türkis',
  'Kapitän Blau',
  'Lagunenblau',
  'Marineblau',
  'Lachsrosa',
  'Sturmbraus-Blau',
  'Krabbenrot',
  'Leuchtturm-Rot',
  'Fischernetz-Rostrot',
  'Voll Korall',
  'Zitronengelb',
  'Goldbarsch Gelb',
  'Panadegold',
  'Dillgrün',
  'Seegras-Grün',
  'Algen-Grün',
  'Tiefsee-Algen-Grün'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'colorselect') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (interaction.member.roles.cache.some(role => role.name === interaction.values[0])) {
        await interaction.editReply(`Du besitzt die Farbe ${interaction.values[0]} bereits.`);
        return;
      }
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
        }
      }
      const role = interaction.guild.roles.cache.find(role => role.name === interaction.values[0]);
      await interaction.guild.members.cache.get(interaction.member.id).roles.add(role);
      console.log(`Role ${interaction.values[0]} was given to user ${interaction.member.user.tag}`);
      await interaction.editReply(`Die Farbe ${interaction.values[0]} wurde dir zugewiesen.`);
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removeColor') {
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          await interaction.editReply(`Die Farbe ${rolenames[i]} wurde dir entzogen.`);
          return;
        }
      }
      await interaction.editReply(`Du hattest gar keine Farbrolle.`);

    }
  }
};