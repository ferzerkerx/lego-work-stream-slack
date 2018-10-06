import { SlackBot, SlackController, SlackMessage } from 'botkit';

function legoOption(name: string, text: string, values: number = 8): any {
  let options: any = [];
  for (let i: number = 0; i <= values; i++) {
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
function saveTeamIfNeeded(bot, controller: SlackController): void {
  let team = {
    id: bot.team_info.id,
    name: bot.team_info.name,
    bot: {
      user_id: bot.identity.id,
      name: bot.identity.name,
    },
  };
  controller.storage.teams.save(team, (err: Error) => {
    if (err) {
      console.error(err);
    }
  });
}

const legoMentionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, message: SlackMessage) => {
      saveTeamIfNeeded(bot, controller);
      bot.reply(message, legoMessage());
    }
  );
};
module.exports = legoMentionHandler;
