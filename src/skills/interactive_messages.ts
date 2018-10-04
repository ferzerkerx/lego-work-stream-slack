import { SlackAttachment, SlackBot } from 'botkit';

module.exports = controller => {
  controller.middleware.receive.use((bot: SlackBot, message, next) => {
    if (message.type == 'interactive_message_callback' && message.actions) {
      if (message.actions[0].name.match(/^lego-select-option-/)) {
        const reply = message.original_message;

        let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
          attachment => attachment.callback_id === 'lego_stats'
        );

        // for (let a = 0; a < reply.attachments.length; a++) {
          //   reply.attachments[a].actions = null;
          // }

        let messageStr = '';
        for (let currentAction of message.actions) {
          for (let selectOption of currentAction.selected_options) {
            messageStr += `${currentAction.name} : ${selectOption.value}`;
          }
        }

        console.log(`message: ${messageStr}`);

        let person = '<@' + message.user + '>';
        if (message.channel[0] == 'D') {
          person = 'You';
        }

        attachmentsToSend.push({
          text: `${person} said, ${messageStr}`,
        });

        reply.attachments = attachmentsToSend;

        bot.replyInteractive(message, reply);
      }
    }

    next();
  });
};
