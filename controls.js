const { dispatchers } = require('./utils');

function play(interaction) {
    const dispatcher = dispatchers[interaction.guild.id];
    if (!dispatcher) return;

    if (dispatcher.paused) {
        dispatcher.resume();
    }
}

function stop(interaction) {
    const dispatcher = dispatchers[interaction.guild.id];
    if (!dispatcher) return;

    dispatcher.pause();
}

function skip(interaction) {
    const dispatcher = dispatchers[interaction.guild.id];
    if (!dispatcher) return;

    dispatcher.end();
}

module.exports = {
    play,
    stop,
    skip
};
