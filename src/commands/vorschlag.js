const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Suggestion = require('../models/Suggestion');
const formatResults = require('../utils/formatResults');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vorschlag')
    .setDescription('Erstelle einen Vorschlag')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    try {
      const modal = new ModalBuilder()
        .setTitle('Erstelle einen Vorschlag')
        .setCustomId(`suggestion-${interaction.user.id}`);

      const textInput = new TextInputBuilder()
        .setCustomId('suggestion-input')
        .setLabel('Was möchtest du vorschlagen?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const actionRow = new ActionRowBuilder().addComponents(textInput);

      modal.addComponents(actionRow);

      await interaction.showModal(modal);

      const filter = (i) => i.customId === `suggestion-${interaction.user.id}`;

      const modalInteraction = await interaction.awaitModalSubmit({
        filter,
        time: 1000 * 60 * 3 //1sec * 60 *3 = 3min
      }).catch((error) => console.log(error));

      await modalInteraction.deferReply({ ephemeral: true })

      let suggestionMessage;

      try {
        suggestionMessage = await interaction.channel.send('Vorschlag wird erstellt, bitte warten...');
      } catch (error) {
        modalInteraction.editReply('Ich konnte den Vorschlag in diesem Channel nicht erstellen. Mir fehlen möglicherweise Berechtigungen.');
        return;
      }

      const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input');

      const newSuggestion = new Suggestion({
        authorId: interaction.user.id,
        guildId: interaction.guildId,
        messageId: suggestionMessage.id,
        content: suggestionText,
      });

      await newSuggestion.save();

      modalInteraction.editReply('Vorschlag erstellt!');
      const suggestionEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }), })
        .addFields({ name: 'Vorschlag', value: suggestionText })
        .addFields({ name: 'Status', value: '⏳Laufend' })
        .addFields({ name: 'Votes', value: formatResults() })
        .setColor(0x0033cc);

      const upvoteButton = new ButtonBuilder()
        .setEmoji('👍')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

      const downvoteButton = new ButtonBuilder()
        .setEmoji('👎')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

      const approveButton = new ButtonBuilder()
        .setEmoji('✅')
        .setLabel('Zustimmen')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

      const rejectButton = new ButtonBuilder()
        .setEmoji('🗑️')
        .setLabel('Ablehnen')
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

      const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
      const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

      suggestionMessage.edit({
        content: `${interaction.user} Vorschlag erstellt!`,
        embeds: [suggestionEmbed],
        components: [firstRow, secondRow]
      })

    } catch (err) {
      console.log(err);
    }

  },
};