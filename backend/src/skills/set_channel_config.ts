import { SlackBot, SlackController, SlackMessage } from 'botkit';
import { ServiceLocator } from '../ServiceLocator';

function reply(
  bot: SlackBot,
  originalMessage: SlackMessage,
  text: string
): void {
  bot.reply(originalMessage, {
    text,
    attachments: [],
    channel: originalMessage.channel,
  });
}

const teamConfigurationHandler = (controller: SlackController): void => {
  controller.hears(
    'setConfig',
    'direct_mention',
    (bot: SlackBot, originalMessage: SlackMessage) => {
      const configStr: string = originalMessage.text.substring(
        'setConfig'.length
      );

      ServiceLocator.getTeamChannelConfigurationService()
        .update(configStr, bot, originalMessage.channel)
        .then(() => {
          reply(bot, originalMessage, 'updated configuration successfully');
        })
        .catch(e => {
          reply(bot, originalMessage, 'Invalid configuration');
        });
    }
  );
};
module.exports = teamConfigurationHandler;
