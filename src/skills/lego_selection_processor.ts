import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';

class MessageRepository {
  static oldMessages: any = {};

  //TODO need to consider channel info in the key
  static findMessage(channel: String, messageId): any {
    return this.oldMessages[messageId];
  }

  static saveMessage(channel: String, messageId, messageData): any {
    this.oldMessages[messageId] = messageData;
    console.log(`oldMessages: ${JSON.stringify(this.oldMessages)}`);
  }
}

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

function createReplyAttachment(message): SlackAttachment {
  let messageId: String = message.original_message.ts;
  let messageStoredData =
    MessageRepository.findMessage(message.channel, messageId) || {};

  let currentAction = message.actions[0];

  let statusForAction = messageStoredData[currentAction.name] || {};
  statusForAction[message.user] = statusForAction[message.user] || {
    user: message.user,
    value: 0,
  };
  statusForAction[message.user].value = currentAction.selected_options[0].value;

  messageStoredData[currentAction.name] = statusForAction;

  MessageRepository.saveMessage(message.channel, messageId, messageStoredData);

  let messageStr: String = formatMessage(messageStoredData);
  console.log(`messageStr: ${messageStr}`);

  return {
    text: `${messageStr}`,
  };
}

function createResponse(message): SlackMessage {
  const reply: SlackMessage = message.original_message;

  let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
    attachment => attachment.callback_id === 'lego_stats'
  );

  let replyStatusAttachment: SlackAttachment = createReplyAttachment(message);
  attachmentsToSend.push(replyStatusAttachment);

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
