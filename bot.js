const Discord = require('discord.js');
require('dotenv').config();

const utils = require('./utils/utils');

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const token = process.env.TOKEN;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const loadCommands = () => {
  const fs = require('fs');

  let files = fs.readdirSync(__dirname + '/commands');

  files.forEach(file => {
    let command = require(`./commands/${ file }`);

    client.commands.set(command.help.name, command);

    if (command.help.aliases) {
      command.help.aliases
        .filter(alias => alias.trim() !== '')
        .forEach(alias => client.aliases.set(alias, command.help.name));
    }
  });
};

const loadEvents = () => {
  const fs = require('fs');

  let files = fs.readdirSync(__dirname + '/events');

  files.forEach(file => {
    let events = require(`./events/${ file }`);

    if (!Array.isArray(events)) {
      events = [events];
    }

    events.forEach(event => {
      client.on(event.name, (...args) => event.run(client, ...args));
    })
  })
};

const start = async () => {
  console.log(utils.getHoraAtual() + ' [INICIALIZAÇÃO] Iniciando...');

  await client.login(token).catch(err => {
    console.error(utils.getHoraAtual() + ' [INICIALIZAÇÃO.Error.login] ', err);

    process.exit();
  });

  console.log(utils.getHoraAtual() + ' [INICIALIZAÇÃO.Events] Carregando eventos...');
  loadEvents();

  console.log(utils.getHoraAtual() + ' [INICIALIZAÇÃO.Commands] Carregando comandos...');
  loadCommands();

  console.log('[INICIALIZAÇÃO] Inicialização concluida.');
};

start();