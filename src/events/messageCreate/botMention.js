const { Message } = require('discord.js');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const answers = new Map([[1, 'Ja!'],
[2, 'Nein!'],
[3, 'Vielleicht!'],
[4, 'Frag erneut!'],
[5, 'Niemals!'],
[6, 'Darauf habe ich keine Antwort!'],
[7, 'Ist das nicht eindeutig?'],
[8, 'Formuliere die Frage bitte klarer.'],
[9, 'Ja, Ja und nochmal Ja!'],
[10, 'Darüber sollte demokratisch abgestimmt werden.'],
[11, 'Ich denke nicht.'],
[12, 'Ich werde darüber nachdenken.'],
[13, 'Auf jeden Fall!'],
[14, 'Nö :P'],
[15, 'Yep!'],
[16, 'Leider nicht. :('],
[17, 'Ich fürchte du bist nicht berechtigt diese Antwort zu erfahren.'],
[18, 'Eher nicht.'],
[19, 'Wie bitte? Wurde ich etwas gefragt?'],
[20, 'Ich bin leider im "Nein-Modus"!'],
[21, 'Schlag seite 394 auf, dort steht die Antwort.'],
[22, 'ERROR: Question to difficult!'],
[23, 'Vielleicht ein anderes Mal.'],
[24, 'Unter anderen Umständen wäre das sicherlich denkbar.'],
[25, 'Gewiss.'],
[26, 'In der Tat.'],
[27, 'Ja, so steht es in der Bibel geschrieben!'],
[28, 'Ich bin noch unentschlossen.'],
[29, 'Ich prüfe das...'],
[30, 'Denk noch einmal genau über deine Frage nach.'],
[31, '69'],
[32, 'Fragen Sie diesbezüglich bitte Basti.'],
[33, 'Wende dich bitte an Verena.'],
[34, 'Kira kann dir das sicherlich beantworten.'],
[35, 'Alex weiß auf alles die Antwort, frag bitte sie.'],
[36, 'Die Antwort ist das Gegenteil von dem, was Jonas antworten würde.'],
[37, 'Ich schmolle und werde deshalb nicht antworten!'],
[38, 'Nur wenn heute Sonntag ist!'],
[39, 'So eine dreiste Frage beantworte ich nicht.'],
[40, 'Wenn du mich sowas nochmal fragst, schicke ich dich von der Planke!']
]);

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message, client) => {
    if (!message.inGuild() || message.author.bot || !message.content.includes(client.user.id) || !message.content.includes("?")) return;
    console.log(`Bot Mentioned`);
    var number = getRandom(1, 31);
    var delay = 2000;
    if (number == 22) {
        let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
        var newMessage = await message.reply(answers.get(number));
        newMessage = await newMessage.reply(`Self destruction initialized!`);
        await sleep(delay);
        newMessage = await newMessage.reply(`3`);
        await sleep(delay);
        newMessage = await newMessage.reply(`2`);
        await sleep(delay);
        newMessage = await newMessage.reply(`1`);
        await sleep(delay);
        const boom = getRandom(1, 4)
        if (boom == 1) {
            newMessage = await newMessage.reply(`BOOM💥`);
        } else if (boom == 2) {
            newMessage = await newMessage.reply(`Self destruction canceled, you are safe!`);
        } else if (boom == 3) {
            newMessage = await newMessage.reply(`https://media1.tenor.com/m/CpMcOSzFKwYAAAAC/suprised-explosion.gif`);
        }
    } else {
        await message.reply(answers.get(number));
    }
};