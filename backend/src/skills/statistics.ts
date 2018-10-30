import { Conversation, SlackController, SlackMessage } from 'botkit';
import { ProcessStatistics } from '../ProcessStatistics';

const statisticsHandler = (controller: SlackController) => {
  controller.on('heard_trigger', () => {
    ProcessStatistics.triggers++;
  });

  controller.on('conversationStarted', () => {
    ProcessStatistics.convos++;
  });

  controller.hears(
    ['^uptime', '^debug'],
    'direct_message,direct_mention',
    (bot, message) => {
      bot.createConversation(
        message,
        (err: Error, convo: Conversation<SlackMessage>) => {
          if (!err) {
            convo.setVar(
              'uptime',
              ProcessStatistics.formatUptime(process.uptime())
            );
            convo.setVar('convos', ProcessStatistics.convos);
            convo.setVar('triggers', ProcessStatistics.triggers);

            convo.say(
              'My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.'
            );
            convo.activate();
          }
        }
      );
    }
  );
};
module.exports = statisticsHandler;
