import { Conversation, SlackController, SlackMessage } from 'botkit';

function formatUptime(uptime: number): string {
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

const statisticsHandler = (controller: SlackController) => {
  const stats = {
    triggers: 0,
    convos: 0,
  };

  controller.on('heard_trigger', () => {
    stats.triggers++;
  });

  controller.on('conversationStarted', () => {
    stats.convos++;
  });

  controller.hears(
    ['^uptime', '^debug'],
    'direct_message,direct_mention',
    (bot, message) => {
      bot.createConversation(
        message,
        (err: Error, convo: Conversation<SlackMessage>) => {
          if (!err) {
            convo.setVar('uptime', formatUptime(process.uptime()));
            convo.setVar('convos', stats.convos);
            convo.setVar('triggers', stats.triggers);

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
