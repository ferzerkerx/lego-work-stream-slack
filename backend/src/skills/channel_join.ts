import { SlackBot, SlackController, SlackMessage } from 'botkit';
import { ErrorUtil } from '../utils/ErrorUtil';
import { LegoMessageFactory } from '../lego/LegoMessageFactory';
import { ServiceLocator } from '../ServiceLocator';

const OnChannelJoinHandler = (controller: SlackController): void => {
  controller.on('bot_channel_join', (bot: SlackBot, message: SlackMessage) => {
    const helloMessage: string =
      'Hello, Thanks for inviting me! I will be helping you to gather some metrics for the team. Try me just mention help';
    bot.reply(message, helloMessage);

    const defaultConfiguration = LegoMessageFactory.defaultConfiguration();

    defaultConfiguration.channelName = message.channel;

    ServiceLocator.getTeamChannelConfigurationRepository()
      .save(defaultConfiguration)
      .then(() => {
        //send event
      })
      .catch(error => ErrorUtil.defaultErrorHandling(error));
  });
};
module.exports = OnChannelJoinHandler;
