import {SlackAttachment, SlackBot, SlackMessage} from 'botkit';

let oldMessages: any = {};

function createSummaryMessage(message): SlackAttachment {
  let messageStoredData = oldMessages[message.original_message.ts] || {};
  oldMessages[message.original_message.ts] = messageStoredData;


  for (let currentAction of message.actions) {
    let statusForAction = messageStoredData[currentAction.name] || {};
    statusForAction[message.user] = statusForAction[message.user] || {
      user: message.user,
      value: currentAction.selected_options[0].value,
    };
    messageStoredData[currentAction.name] = statusForAction;


    let messageStr: String = '';
    for (const actionName of Object.keys(messageStoredData)) {
      const actionData = messageStoredData[actionName];
      messageStr += `${actionName}: `;
      for (const entryKey of Object.keys(actionData)) {
        const entryData = actionData[entryKey];
        messageStr += `<@${entryData.user}>:${entryData.value}, `;
      }
    }
    console.log(`messageStr: ${messageStr}`);
    console.log(`oldMessages: ${JSON.stringify(oldMessages)}`);

    return {
      text: `${messageStr}`,
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
