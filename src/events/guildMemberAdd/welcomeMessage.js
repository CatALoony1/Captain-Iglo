require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
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
        const welcome = new EmbedBuilder()
            .setColor(0x0033cc)
            .setAuthor({ name: guildMember.user.username, iconURL: guildMember.user.displayAvatarURL({ size: 256 }) })
            .setTitle(`⚓ Willkommen an Bord des Captain Iglo Servers! 🐟\nBereite dich auf spannende Abenteuer auf den sieben Weltmeeren vor! 🌊`)
            .setImage('https://media1.tenor.com/m/Ir6lg8ixJpYAAAAC/sailor-channing-tatum.gif')
            ;

        var message = await targetChannel.send(`||${role} <@${guildMember.id}>||`);
        await message.reply({ embeds: [welcome] });
        message.delete();
    } catch (error) {
        console.log(error);
    }
};