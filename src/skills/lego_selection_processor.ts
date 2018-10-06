import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';

function formatMessage(messageStoredData): String {
  let messageStr: String = '';
  for (const actionName of Object.keys(messageStoredData)) {
    const actionData = messageStoredData[actionName];
    messageStr += `${actionName}: `;
    for (const entryKey of Object.keys(actionData)) {
      const entryData = actionData[entryKey];
      if (entryData.value) {
        messageStr += `<@${entryData.user}>:${entryData.value}, `;
      }
    }
    messageStr += `\n`;
  }
  return messageStr;
}

function updatedStatusForAction(messageStoredData, message): any {
  let currentAction = message.actions[0];

  let statusForAction = messageStoredData[currentAction.name] || {};
  statusForAction[message.user] = statusForAction[message.user] || {
    user: message.user,
    value: 0,
  };
  statusForAction[message.user].value = currentAction.selected_options[0].value;

  return {
    actionName: currentAction.name,
    statusForAction: statusForAction,
  };
}

function defaultErrorHandling(err) {
  console.error(err);
}

module.exports = controller => {
  function attachmentsToSend(messageStoredData, message): SlackAttachment[] {
    const reply: SlackMessage = message.original_message;

    let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
      attachment => attachment.callback_id === 'lego_stats'
    );
    attachmentsToSend.push({
      text: `${formatMessage(messageStoredData)}`,
    });

    return attachmentsToSend;
  }

  function updateMessage(messageData, message) {
    let messageStoredData = messageData || {};
    let { actionName, statusForAction } = updatedStatusForAction(
      messageStoredData,
      message
    );
    messageStoredData[actionName] = statusForAction;

    return messageStoredData;
  }

  controller.middleware.receive.use((bot: SlackBot, message, next) => {
    if (message.type == 'interactive_message_callback' && message.actions) {
      if (message.actions[0].name.match(/^lego-select-option-/)) {
        let fullMessageId = `${message.channel}_${message.original_message.ts}`;

        controller.storage.lego_messages.get(
          fullMessageId,
          (err, messageData) => {
            if (err) {
              defaultErrorHandling(err);
            } else {
              let messageStoredData = updateMessage(messageData || {}, message);
              controller.storage.lego_messages.save(
                { id: fullMessageId, messageStoredData },
                err => defaultErrorHandling(err)
              );

              const reply: SlackMessage = message.original_message;
              reply.attachments = attachmentsToSend(messageStoredData, message);
              bot.replyInteractive(message, reply);
            }
          }
        );
      }
    }

    next();
  });
};
