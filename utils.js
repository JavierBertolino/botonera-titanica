const { MessageActionRow, MessageButton } = require('discord.js');
const SoundCloud = require('soundcloud-scraper');

let playCommands = {};
let connections = {};
let dispatchers = {};

async function playMusic(interaction) {
    const command = playCommands[interaction.user.id];
    if (!command) return;

    const matchIndex = parseInt(interaction.customId.slice(5));
    const match = command.matches[matchIndex];
    if (!match) return;

    const connection = await command.channel.join();
    connections[interaction.guild.id] = connection;

    let streamUrl;
    if (match.url.includes('youtube.com')) {
        streamUrl = match.url;
    } else {
        const client = new SoundCloud.Client();
        const song = await client.getSongInfo(match.url);
        streamUrl = song.streamURL;
    }

    const dispatcher = connection.play(streamUrl);
    dispatchers[interaction.guild.id] = dispatcher;

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('play')
                .setLabel('Play')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('skip')
                .setLabel('Skip')
                .setStyle('SUCCESS'),
        );

    interaction.channel.send({ content: 'Controls:', components: [row] });
}

module.exports = {
    playCommands,
    connections,
    dispatchers,
    playMusic
};
