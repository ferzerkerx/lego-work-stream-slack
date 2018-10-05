import { SlackMessage } from 'botkit';

function legoOption(name, text, values = 8) {
  let options = [];
  for (let i = 0; i <= values; i++) {
    options.push({
      text: `${i}`,
      value: i,
    });
  }
  return {
    name: name,
    text: text,
    type: 'select',
    options: options,
  };
}

function legoMessage(): SlackMessage {
  return {
    text: 'Please select your Legos',
    attachments: [
      {
        text: 'Choose your legos!',
        fallback: 'Unable to set lego stats',
        callback_id: 'lego_stats',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          legoOption('lego-select-option-green', 'Green'),
          legoOption('lego-select-option-red', 'Red'),
          legoOption('lego-select-option-orange', 'Orange'),
          legoOption('lego-select-option-black', 'Black'),
        ],
      },
    ],
  };
}
//TODO this function needs to be called when the bot starts
function saveTeamIfNeeded(bot, controller) {
  let team = {
    id: bot.team_info.id,
    name: bot.team_info.name,
    bot: {
      user_id: bot.identity.id,
      name: bot.identity.name,
    },
  };
  controller.storage.teams.save(team, err => {
    if (err) console.error(err);
  });
}

module.exports = controller => {
  controller.hears('lego', 'direct_mention', (bot, message) => {
    saveTeamIfNeeded(bot, controller);
    bot.reply(message, legoMessage());
  });
};
