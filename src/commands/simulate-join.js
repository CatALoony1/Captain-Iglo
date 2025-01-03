const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName('simulate-join')
    .setDescription('Simulate a member joining.')
    .addUserOption((option) =>
      option
        .setName('target-user')
        .setDescription('The user you want to emulate joining.')
    ),

  /**
 * @param {import('commandkit').SlashCommandProps} param0
 */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const targetUser = interaction.options.getUser('target-user');

    let member;

    if (targetUser) {
      member =
        interaction.guild.members.cache.get(targetUser.id) ||
        (await interaction.guild.members.fetch(targetUser.id));
    } else {
      member = interaction.member;
    }

    client.emit('guildMemberAdd', member);

    interaction.reply('Simulated join!');
  },
};