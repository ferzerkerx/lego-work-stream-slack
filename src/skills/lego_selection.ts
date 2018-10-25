import { SlackBot, SlackController, SlackMessage } from 'botkit';
import { LegoMessageConfig, LegoMessageFactory } from '../lego/LegoMessageFactory';

const legoSelectionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, originalMessage: SlackMessage) => {
      // @ts-ignore
      const storage: Storage<LegoMessageConfig> =
        controller.storage.team_configurations;

      LegoMessageFactory.createMessage(
        storage,
        originalMessage.channel,
        new Date()
      ).then(replyMessage => {
        bot.reply(originalMessage, replyMessage);
      });
    }
  );
};
module.exports = legoSelectionHandler;
