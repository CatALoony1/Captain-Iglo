require('dotenv').config();
const { EmbedBuilder, WebhookClient } = require('discord.js');
const Begruessung = require('../../models/Begruessung');
const getTenorGifById = require('../../utils/getTenorGifById');

/**
 * 
 * @param {import {'discord.js'}.GuildMember} guildMember 
 * @returns 
 */
module.exports = async (guildMember) => {
    if (guildMember.user.bot) return;
    console.log(`user ${guildMember.user.tag} joined`);
    const role = guildMember.guild.roles.cache.find(role => role.name === 'Begrüßungskomitee');
    try {
        const targetChannel = guildMember.guild.channels.cache.get(process.env.WELCOME_ID) || (await guildMember.guild.channels.fetch(process.env.WELCOME_ID));
        if (!targetChannel) {
            console.log('Fehler, Willkommenschannel gibts nicht');
            return;
        }
        await getTenorGifById("5452863")
            .then(async (gifUrl) => {
                if (!gifUrl.includes("http")) {
                    console.log("ERROR Welcome gif");
                    return;
                }
                const welcome = new EmbedBuilder()
                    .setColor(0x0033cc)
                    .setAuthor({ name: guildMember.user.username, iconURL: guildMember.user.displayAvatarURL({ size: 256 }) })
                    .setTitle(`⚓ Willkommen an Bord des Captain Iglo Servers! 🐟\nBereite dich auf spannende Abenteuer auf den sieben Weltmeeren vor! 🌊`)
                    .setImage(gifUrl);
                await targetChannel.send({ content: `${role} <@${guildMember.id}>`, embeds: [welcome] });
                var allbegruessungen = await Begruessung.find({ guildId: guildMember.guild.id, zugestimmt: 'J' });
                if (allbegruessungen.length > 0) {
                    for (const begruessung of allbegruessungen) {
                        let webhookClient = new WebhookClient({ id: begruessung.webhookId, token: begruessung.webhookToken });
                        await webhookClient.send(begruessung.content.replaceAll('<new>', `<@${guildMember.id}>`));
                    }
                }
            })
            .catch((error) => {
                console.error('ERROR:', error);
            });


    } catch (error) {
        console.log(error);
    }
};