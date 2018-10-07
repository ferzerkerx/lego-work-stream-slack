import { Conversation, SlackController, SlackMessage } from 'botkit';

class Statistics {
  static triggers: number = 0;
  static convos: number = 0;

  static formatUptime(uptime: number): string {
    let unit: string = 'second';
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = 'minute';
    }
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = 'hour';
    }
    if (uptime != 1) {
      unit = unit + 's';
    }
    return `${uptime} ${unit}`;
  }
}

const statisticsHandler = (controller: SlackController) => {
  controller.on('heard_trigger', () => {
    Statistics.triggers++;
  });

  controller.on('conversationStarted', () => {
    Statistics.convos++;
  });

  controller.hears(
    ['^uptime', '^debug'],
    'direct_message,direct_mention',
    (bot, message) => {
      bot.createConversation(
        message,
        (err: Error, convo: Conversation<SlackMessage>) => {
          if (!err) {
            convo.setVar('uptime', Statistics.formatUptime(process.uptime()));
            convo.setVar('convos', Statistics.convos);
            convo.setVar('triggers', Statistics.triggers);

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
