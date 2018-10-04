import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';

let oldMessages: any = {};

function createSummaryMessage(message): SlackAttachment {
  let oldMessage = oldMessages[message.original_message.ts] || {};
  if (!oldMessage) {
    oldMessages[message.original_message.ts] = oldMessage;
  }

  let messageStr: String = '';
  for (let currentAction of message.actions) {
    let statusForAction = oldMessage[currentAction.name] || {};
    let entryForUser = statusForAction[message.user] || {
      value: currentAction.selected_options[0].value,
    };

    statusForAction[message.user] = entryForUser;
    oldMessage[currentAction.name] = statusForAction;

    console.log(`oldMessages: ${JSON.stringify(oldMessages)}`);

    let person = `<@${message.user}>`;

    return {
      text: `${person} said, ${messageStr}`,
    };
  }
  return {};
}

function createResponse(message): SlackMessage {
  const reply: SlackMessage = message.original_message;

  let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
    attachment => attachment.callback_id === 'lego_stats'
  );

  let replyStatusMessage: SlackAttachment = createSummaryMessage(message);
  attachmentsToSend.push(replyStatusMessage);

  reply.attachments = attachmentsToSend;
  return reply;
}

module.exports = controller => {
  controller.middleware.receive.use((bot: SlackBot, message, next) => {
    if (message.type == 'interactive_message_callback' && message.actions) {
      if (message.actions[0].name.match(/^lego-select-option-/)) {
        console.log(`tes: ${message.original_message.ts}`);

        bot.replyInteractive(message, createResponse(message));
      }
    }

    next();
  });
};
