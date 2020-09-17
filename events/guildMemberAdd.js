const config = require('../config/config.json');

const guildMemberAdd = async (client, member) => {
  const channel = member.guild.channels.cache.find(ch => ch.id === config.welcomeChannelID);

  if (!channel) {
    return;
  }

  channel.send(config.welcomeMessage.replace('{member}', member).replace('{guildName}', channel.guild.name));
};

module.exports = {
  name: 'guildMemberAdd',
  run: guildMemberAdd
}