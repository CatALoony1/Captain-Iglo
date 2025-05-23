const Discord = require("discord.js");
const Question = require('../../models/QuizQuestion');
const giveXP = require('../../utils/giveXP');

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId.includes(`quizadd-${interaction.user.id}`)) {
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
        const frage = interaction.fields.getTextInputValue('quizadd-frage');
        const richtig = interaction.fields.getTextInputValue('quizadd-richtig');
        const falsch1 = interaction.fields.getTextInputValue('quizadd-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('quizadd-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('quizadd-falsch3');
        const [, , mentionedUserId] = interaction.customId.split('-');
        const wrong = `${falsch1}/${falsch2}/${falsch3}`;
        const participants = [];
        participants[0] = mentionedUserId;
        const newQuestion = new Question({
            question: frage,
            right: richtig,
            wrong: wrong,
            participants: participants,
            guildId: process.env.GUILD_ID,
        });
        await newQuestion.save();
        var targetChannel = interaction.guild.channels.cache.get(process.env.QUIZ_ID) || (await interaction.guild.channels.fetch(process.env.QUIZ_ID));
        const targetUserObj = await interaction.guild.members.fetch(mentionedUserId);
        var xpToGive = 100;
        await giveXP(targetUserObj, xpToGive, xpToGive, targetChannel, false, false, true);
        interaction.editReply('Frage eingetragen!');
    }
};