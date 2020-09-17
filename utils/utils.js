const Discord = require('discord.js');

module.exports = {
  nextWeekdayDate: (date, dayInWeek) => {
    const ret = new Date(date || new Date());
    
    ret.setDate(ret.getDate() + (dayInWeek - 1 - ret.getDay() + 7) % 7 + 1);
    
    return ret;
  },

  showError: (error, message) => {
    let err = 'Error!',
      msg = '';

    if (error === 'Response: 400' || error === 400) {
      err = 'Requisição inválida.';
    } else if (error === 'Response: 404' || error === 404) {
      err = 'Conteúdo não encontrado.';
    } else if (error === 500 || error === 'Responde: 500') {
      err = 'Ocorreu um erro no serviço.'
    } else if (error === '!nsfw') {
      err = 'Este comando só pode ser usado em um canal NSFW!';
    } else if (error === '!permission') {
      err = 'Você não tem acesso à este comando!';
    } else {
      err = error;
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(`Erro!`)
      .setDescription(err)
      .setFooter(msg)
      .setColor(0xff0000);

    return embed;
  },

  getHoraAtual: () => {
    const data = new Date();

    return `${ data.getHours() > 9 ? data.getHours() : `0${ data.getHours() }` }:${ data.getMinutes() > 9 ? data.getMinutes() : `0${ data.getMinutes() }` }:${ data.getSeconds() > 9 ? data.getSeconds() : `0${ data.getSeconds() }`}`;
  },

  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
  },

  formatUserID: (id) => {
    return id.replace(/</g, '').replace(/!/g, '').replace(/@/g, '').replace(/>/g, '');
  },

  getArgs: (wordArray) => {
    let args = [];
    let newString = '';
    let numStrArgs = 1;
    let numNumArgs = 1;
    let numLinkArgs = 1;

    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i].startsWith('-')) {
        let value = '';

        for (let j = i + 1; j < wordArray.length && !wordArray[j].startsWith('-'); j++) {
          value += wordArray[j] + ' ';

          let aux = value;

          wordArray.splice(j, 1);
          j--;

          if ((j === i + 1 && !aux.startsWith('"')) || value.endsWith('" ') || !value.startsWith('"')) {
            break;
          }
        }

        args.push({
          name: wordArray[i].slice(1),
          value: value.length > 0 ? value.replace(/"/g, ' ').trim() : true
        });
      } else {
        let value = wordArray[i] + ' ';

        for (let j = i + 1; j < wordArray.length && !wordArray[j].startsWith('-'); j++) {
          value += wordArray[j] + ' ';

          let aux = value;

          wordArray.splice(j, 1);
          j--;
        }

        args.push({
          name: 'string' + numStrArgs++,
          value: value.trim()
        });
      }
    }

    for (let i = 0; i < args.length; i++) {
      if (typeof(args[i].value) === String && (args[i].value.startsWith('http://') || args[i].value.startsWith('https://'))) {
        args[i].name = 'link' + numLinkArgs++;
        numStrArgs--;
        const newString = args[i].value.split(' ').slice(1).toString().replace(/,/g, ' ');

        for (let j = i + 1; j < args.length; j++) {
          if (args[j].name.startsWith('string')) {
            args[j].name = args[j].name.replace(/\d+/g, match => {
              return parseInt(match) - 1;
            });
          }
        }

        args.push({
          name: 'string' + numStrArgs++,
          value: newString.trim()
        });

        args[i].value = args[i].value.split(' ')[0];
      }
    }

    args.sort((arg, arg2) => {
      if (arg.name > arg2.name) {
        return 1;
      } else if (arg2.name > arg.name){
        return -1;
      }

      return 0;
    });

    return args;
  }
}