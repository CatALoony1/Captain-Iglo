const Discord = require("discord.js");
const Begruessung = require('../../models/Begruessung');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @returns 
 */
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `begruessung-${interaction.user.id}`) {
        try {
            var targetChannel = interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) || (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
            await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
            if (interaction.fields.getTextInputValue('begruessung-text').includes('<@')) {
                interaction.editReply('Pings von Nutzern oder Rollen sind nicht erlaubt!');
                return;
            }
            const text = interaction.fields.getTextInputValue('begruessung-text').replaceAll('<me>', `<@${interaction.user.id}>`);
            const begruessungEmbed = new Discord.EmbedBuilder();
            begruessungEmbed.setColor(0x0033cc);
            begruessungEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
            begruessungEmbed.setTitle(`Begrüßung:`);
            begruessungEmbed.setDescription(text);
            const approveButton = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setLabel('Zustimmen')
                .setStyle(Discord.ButtonStyle.Success)
                .setCustomId(`begruessung.${interaction.user.id}.approve`);
            const rejectButton = new Discord.ButtonBuilder()
                .setEmoji('🗑️')
                .setLabel('Ablehnen')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId(`begruessung.${interaction.user.id}.reject`);
            const buttonrow = new Discord.ActionRowBuilder().addComponents(approveButton, rejectButton);
            await targetChannel.send({
                embeds: [begruessungEmbed],
                components: [buttonrow]
            });

            const begruessung = await Begruessung.findOne({
                guildId: interaction.guild.id,
                authorId: interaction.user.id,
            });
            if (begruessung && !text.includes('TESTJG')) {
                begruessung.content = text;
                begruessung.zugestimmt = "X";
                await begruessung.save();
            } else {
                if(text.includes('TESTJG')){
                    const targetUserObj = await interaction.guild.members.fetch('345554876153200642');
                    var welcomeChannel = interaction.guild.channels.cache.get(process.env.WELCOME_ID) || (await interaction.guild.channels.fetch(process.env.WELCOME_ID));
                    await welcomeChannel.createWebhook({
                        name: targetUserObj.user.displayName,
                        avatar: targetUserObj.user.displayAvatarURL({ size: 256 }),
                    })
                        .then(webhook => new Begruessung({
                            guildId: interaction.guild.id,
                            authorId: targetUserObj.user.id,
                            content: text,
                            webhookId: webhook.id,
                            webhookToken: webhook.token,
                        }).save())
                        .catch(console.error);
                }else{
                    var welcomeChannel = interaction.guild.channels.cache.get(process.env.WELCOME_ID) || (await interaction.guild.channels.fetch(process.env.WELCOME_ID));
                    await welcomeChannel.createWebhook({
                        name: interaction.user.displayName,
                        avatar: interaction.user.displayAvatarURL({ size: 256 }),
                    })
                        .then(webhook => new Begruessung({
                            guildId: interaction.guild.id,
                            authorId: interaction.user.id,
                            content: text,
                            webhookId: webhook.id,
                            webhookToken: webhook.token,
                        }).save())
                        .catch(console.error);
                }
                
            }
            interaction.editReply('Begrüßung zur Überprüfung abgegeben.');
        } catch (error) {
            console.log(error);
        }
    }
};