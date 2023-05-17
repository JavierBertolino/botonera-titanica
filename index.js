require('dotenv').config()
const { GatewayIntentBits } = require('discord.js');
const commands = require('./commands');
const controls = require('./controls');
const { playMusic } = require('./utils');
const { Client } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ]
});
const prefix = "&";

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', async message => {
    console.log("LLEGO!", message)
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (commands[command]) {
        commands[command](message, args);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('match')) {
        await playMusic(interaction);
    } else if (['play', 'stop', 'skip'].includes(interaction.customId)) {
        controls[interaction.customId](interaction);
    }
});

client.login(process.env.BOT_TOKEN);
