const config = require('../config/config.json');

const guildMemberRemove = (client, member) => {
  const channel = member.guild.channels.cache.find(ch => ch.id === config.welcomeChannelID);

  if (!channel) {
    return;
  }

  channel.send(config.leaveMessage.replace('{member}', member));
};

module.exports = {
  name: 'guildMemberRemove',
  run: guildMemberRemove
}