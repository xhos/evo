const { AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const skipTrack = require('../../utils/skipTrack');

module.exports = (player, oldState, newState) => {
  // Check if the player has just become idle
  if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
    console.log('The audio player has just become idle');
    // Check if the bot is connected to a voice channel
    const connection = getVoiceConnection(player.guildId);
    if (!connection) {
      console.log('Not connected to a voice channel.');
      return;
    }
    // Play the next track
    skipTrack(player.guildId, 1);
  }
};