const createLeaderboardEmbeds = require("../../utils/createLeaderboardEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId) return;
    if (interaction.customId === 'lPageDown') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage - 2, interaction)],
                    components: [interaction.components[0]]
                })
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf Seite 1.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: `Fehler: Probiere es erneut oder kontaktiere bei erneutem Auftreten einen Admin.`, ephemeral: true });
        }
    } else if (interaction.customId === 'lPageUp') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != maxpage) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage - 2, interaction)],
                    components: [interaction.components[0]]
                })
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: `Fehler: Probiere es erneut oder kontaktiere bei erneutem Auftreten einen Admin.`, ephemeral: true });
        }
    }
};