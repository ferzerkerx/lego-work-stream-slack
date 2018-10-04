import { SlackAttachment, SlackBot } from 'botkit';

module.exports = controller => {
  controller.middleware.receive.use((bot: SlackBot, message, next) => {
    if (message.type == 'interactive_message_callback' && message.actions) {
      if (message.actions[0].name.match(/^lego-select-option-/)) {
        const reply = message.original_message;

        let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
          attachment => attachment.type === 'select'
        );

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

        bot.replyInteractive(message, reply);

        reply.attachments = attachmentsToSend;
      }
    }

    next();
  });
};
