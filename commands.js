const { MessageActionRow, MessageButton } = require('discord.js');
const { playCommands } = require('./utils');
const YouTube = require('youtube-sr').default;
const SoundCloud = require('soundcloud-scraper');

async function searchYouTube(query) {
    const results = await YouTube.search(query, { limit: 7 });
    return results.map(result => ({ title: result.title, url: result.url }));
}

async function searchSoundCloud(query) {
    const client = new SoundCloud.Client();
    const results = await client.search(query, 'track', 7);
    return results.map(result => ({ title: result.title, url: result.url }));
}

async function play(message, args) {
    if (!message.member.voice.channel) {
        message.reply('You need to join a voice channel first!');
        return;
    }

    const query = args.join(' ');
    const [youtubeResults, soundcloudResults] = await Promise.all([
        searchYouTube(query),
        searchSoundCloud(query)
    ]);

    const matches = [...youtubeResults, ...soundcloudResults];
    if (matches.length === 0) {
        message.reply('No matches found!');
        return;
    }

    playCommands[message.author.id] = { matches: matches, channel: message.member.voice.channel };

    const row = new MessageActionRow().addComponents(
        matches.map((match, index) => new MessageButton()
            .setCustomId(`match${index}`)
            .setLabel(match.title)
            .setStyle('PRIMARY'))
    );

    message.channel.send({ content: 'Choose a match:', components: [row] });
}

function stop(message, args) {
    // Insert your code here for the stop function...
}

module.exports = {
    play,
    stop
};
