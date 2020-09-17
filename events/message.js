const utils = require('../utils/utils');
const config = require('../config/config.json');

const message = async (client, msg) => {
  if (msg.author.id === config.botID) {
    return;
  }

  if (!msg.content.startsWith(config.prefix)) {
    return;
  }

  const args = utils.getArgs(msg.content.split(' ').slice(1));
  const cmd = msg.content.split(' ')[0];

  const command = getCommand(client, cmd);

  if (command) {
    console.log(`[COMANDO.${ command.help.name }.Run] Argumentos: ${ args.length > 0 ? args.map(arg => ` ${arg.name } = ${ arg.value }`) : ' ' }`);
    command.run(client, msg, args);
  }
};

const getCommand = (client, commandName) => {
  commandName = commandName.slice(`${ config.prefix }`.length);

  let command = client.commands.get(commandName);

  if (!command) {
    command = client.commands.get(client.aliases.get(commandName));
  }

  return command
}

module.exports = {
  name: 'message',
  run: message
}