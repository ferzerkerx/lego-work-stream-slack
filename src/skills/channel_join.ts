import { SlackBot, SlackController, SlackMessage } from 'botkit';

const OnChannelJoinHandler = (controller: SlackController): void => {
  controller.on('bot_channel_join', (bot: SlackBot, message: SlackMessage) => {
    bot.reply(
      message,
      'Hello, Thanks for inviting me! I will be helping you to gather some metrics for the team. Try me just mention legos'
    );
  });
};
module.exports = OnChannelJoinHandler;
