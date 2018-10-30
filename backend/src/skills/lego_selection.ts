import { SlackBot, SlackController, SlackMessage } from 'botkit';
import {
  LegoMessageFactory,
  TeamChannelConfiguration,
} from '../lego/LegoMessageFactory';
import { Container } from '../Container';
import { TeamChannelConfigurationRepository } from '../lego/Types';

function getTeamChannelConfigurationRepository() {
  return Container.resolve<TeamChannelConfigurationRepository>(
    'teamChannelConfigurationRepository'
  );
}

const legoSelectionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, originalMessage: SlackMessage) => {
      getTeamChannelConfigurationRepository()
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
