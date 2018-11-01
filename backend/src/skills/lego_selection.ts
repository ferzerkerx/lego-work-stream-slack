import { SlackBot, SlackController, SlackMessage } from 'botkit';
import {
  LegoMessageFactory,
  TeamChannelConfiguration,
} from '../lego/LegoMessageFactory';
import { ServiceLocator } from '../ServiceLocator';

const legoSelectionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, originalMessage: SlackMessage) => {
      ServiceLocator.getTeamChannelConfigurationRepository()
        .find(originalMessage.channel)
        .then((configuration: TeamChannelConfiguration) => {
          if (configuration) {
            const replyMessage = LegoMessageFactory.createMessage(
              configuration,
              new Date()
            );
            bot.reply(originalMessage, replyMessage);
          }
        });
    }
  );
};
module.exports = legoSelectionHandler;
