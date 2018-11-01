import { SlackBot, SlackController, SlackMessage } from 'botkit';
import { ServiceLocator } from '../ServiceLocator';

function replyMessage(replyText: string, channelName) {
  return {
    text: replyText,
    attachments: [],
    channel: channelName,
  };
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
        .update(configStr, bot)
        .then(() => {
          bot.reply(
            originalMessage,
            replyMessage(
              'updated configuration successfully',
              originalMessage.channel
            )
          );
        })
        .catch(e => {
          bot.reply(
            originalMessage,
            replyMessage('Invalid configuration', originalMessage.channel)
          );
        });
    }
  );
};
module.exports = teamConfigurationHandler;
