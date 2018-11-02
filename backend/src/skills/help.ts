import { SlackBot, SlackController, SlackMessage } from 'botkit';

const summary: any = [
  {
    command: 'lego',
    description: 'Helps channel tracking the time spent on tasks.',
  },
  {
    command: 'setConfig',
    description: 'Will update channel configuration for legos',
  },
  { command: 'help', description: 'Prints this menu.' },
  { command: 'uptime', description: 'Internal bot statistics.' },
];

const helpHandler = (controller: SlackController): void => {
  controller.hears(
    'help',
    'direct_mention',
    (bot: SlackBot, message: SlackMessage) => {
      let messageStr = summary
        .map(item => `${item.command} - ${item.description}`)
        .join('\n');

      bot.reply(message, messageStr);
    }
  );
};
module.exports = helpHandler;
