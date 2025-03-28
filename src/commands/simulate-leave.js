const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simulate-leave')
    .setDescription('Simulate a member leaving.')
    .addUserOption((option) =>
      option
        .setName('target-user')
        .setDescription('The user you want to emulate leaving.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
 * @param {import('commandkit').SlashCommandProps} param0
 */
  run: async ({ interaction, client }) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (interaction.user.id != process.env.ADMIN_ID) {
      await interaction.editReply('Du darfst das nicht!!!!');
      return;
    }
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

    client.emit('guildMemberRemove', member);

    await interaction.editReply('Simulated leave!');
  },
  options: {
    devOnly: true,
    deleted: false,
  },
};