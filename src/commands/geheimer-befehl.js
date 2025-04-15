const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const giveXP = require('../utils/giveXP');
const removeXP = require('../utils/removeXP');
const getTenorGif = require('../utils/getTenorGif');
const Config = require('../models/Config');
const BotState = require('../models/BotState');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geheimer-befehl')
        .setDescription('Geheim!')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const targetUserId = interaction.member.id;
            const targetUserObj = interaction.member;
            let zufallszahl = getRandom(1, 10);
            if (zufallszahl == 1) {
                if (!targetUserObj.roles.cache.some(role => role.name === 'Captains')) {
                    const duration = getRandom(1, 7200);
                    targetUserObj.timeout(duration * 1000, 'Berühre keine Sachen, die du nicht berühren solltest!')
                        .then(console.log(`Timeouted for ${duration} seconds.`))
                        .catch(console.error);
                    await interaction.reply(`Du wurdest für ${duration} Sekunden getimeoutet!`);
                } else {
                    await interaction.reply(`Ich kann doch niemand höhergestelltem einen Timeout geben! Bitte verzeihen Sie mir!`);
                }
            } else if (zufallszahl == 2) {
                let amount = getRandom(1, 100);
                amount = await giveXP(targetUserObj, amount, amount, interaction.channel, false, false, false);
                await interaction.reply(`Dieser Befehl ist geheim, deshalb erhälst du ${amount}XP Schweigegeld!`);
            } else if (zufallszahl == 3) {
                let amount = getRandom(1, 200);
                amount = await removeXP(targetUserObj, amount, interaction.channel);
                await interaction.reply(`Hör auf diesen Befehl zu benutzen, ich ziehe dir als Strafe ${amount}XP ab!`);
            } else if (zufallszahl == 4) {
                await getTenorGif('Stop it')
                    .then((gifUrl) => {
                        interaction.reply(gifUrl);
                    })
                    .catch((error) => {
                        console.error('ERROR:', error);
                    });
            } else if (zufallszahl == 5) {
                interaction.deferReply();
                let state = await BotState.findOne({
                    guildId: interaction.guild.id,
                });
                state.state = 'fischstäbchen';
                state.startTime = Date.now();
                await client.user.setAvatar('./img/iglo_fisch.jpg');
                await client.user.setUsername('Fischstäbchen');
                await interaction.editReply('...');
                await state.save();
            } else if (zufallszahl == 6) {
                client.emit('guildMemberRemove', targetUserObj);
                await interaction.reply(`Bye`);
            } else if (zufallszahl == 7) {
                const config = await Config.findOne({
                    key: 'quizTimeout',
                });
                config.value = `${config.value}${targetUserId},`;
                await config.save();
                await interaction.reply(`Hier passieren geheime Sachen!`);
            } else if (zufallszahl == 8) {
                if (!targetUserObj.roles.cache.some(role => role.name === 'Geheimniswahrer')) {
                    const role = interaction.guild.roles.cache.find(role => role.name === 'Geheimniswahrer');
                    await targetUserObj.roles.add(role);
                    console.log(`Role Geheimniswahrer was given to user ${targetUserObj.user.tag}`);
                    await interaction.reply({ content: `Das Geheimnis ist "Grünkohl".`, flags: MessageFlags.Ephemeral });
                } else {
                    console.log(`User is already Geheimniswahrer`);
                    await interaction.reply('Du bist bereits im Wissen des Geheimnisses.');
                }
            } else if (zufallszahl == 9) {
                await interaction.deferReply();
                let state = await BotState.findOne({
                    guildId: interaction.guild.id,
                });
                var hornycount = state.hornyCount + 1;
                await interaction.editReply('Ein geheimnisvoller Zähler wurde soeben hochgezählt!');
                if (hornycount == 20) {
                    if (state.state == 'fischstäbchen') {
                        await client.user.setUsername('Captain Iglo');
                    }
                    hornycount = 0;
                    state.state = 'horny';
                    state.startTime = Date.now();
                    await client.user.setAvatar('./img/iglo_horny.jpg');
                    await interaction.editReply('Ich bin jetzt horny!💦');
                }
                state.hornyCount = hornycount;
                await state.save();
            } else if (zufallszahl == 10) {
                await targetUserObj.setNickname('Neugieriges Stück', 'Wollte das Geheimnis wissen.')
                    .then(member => console.log(`Set nickname of ${member.user.username}`))
                    .catch(console.error);
                await interaction.reply('Dein neuer Name passt besser zu dir!');
            }
        } catch (error) {
            console.log(error);
        }
    },
};