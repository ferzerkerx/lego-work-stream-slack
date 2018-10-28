import { SlackBot, SlackController, SlackMessage } from 'botkit';
import {
  TeamChannelConfiguration,
  LegoMessageFactory,
} from '../lego/LegoMessageFactory';

const legoSelectionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, originalMessage: SlackMessage) => {
      // @ts-ignore
      controller.storage.team_configurations
        .find({ channelName: originalMessage.channel })
        .then((configurations: TeamChannelConfiguration[]) => {
          if (configurations && configurations.length > 0) {
            const replyMessage = LegoMessageFactory.createMessage(
              configurations[0],
              new Date()
            );

            bot.reply(originalMessage, replyMessage);
          }
        });
    }
  );
};
module.exports = legoSelectionHandler;
