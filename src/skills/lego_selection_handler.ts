import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';
import { NextFunction } from 'express';

class LegoSelectedValue {
  id: string;
  entries: LegoSelectedValueEntry[] = [];
}

class LegoSelectedValueEntry {
  user: string;
  value: number = 0;
}
class LegoMessage {
  id: string;
  selectedValues: LegoSelectedValue[] = [];
  channel: string;
  date: Date = new Date();
}

function formatMessage(legoSelectedValues: LegoSelectedValue[]): string {
  let messageStr: string = '';

  for (let legoSelectedValue of legoSelectedValues) {
    messageStr += `${legoSelectedValue.id}: `;
    for (let entry of legoSelectedValue.entries) {
      if (entry.value) {
        messageStr += `<@${entry.user}>:${entry.value}, `;
      }
    }
    messageStr += `\n`;
  }
  return messageStr;
}

function createLegoMessage(params: {
  legoMessage: LegoMessage;
  fullMessageId: string;
  user: string;
  action: string;
  channel: string;
}): LegoMessage {
  const storedLegoMessage: LegoMessage =
    params.legoMessage || new LegoMessage();
  let selectedValues: LegoSelectedValue[] = updateLegoSelectedValues(
    storedLegoMessage.selectedValues || [],
    params.user,
    params.action
  );

  return {
    id: params.fullMessageId,
    selectedValues: selectedValues,
    channel: params.channel,
    date: storedLegoMessage.date,
  };
}

function updateLegoSelectedValues(
  currentSelectedValues: LegoSelectedValue[] = [],
  user,
  action
): LegoSelectedValue[] {
  let selectedValues: LegoSelectedValue[] = currentSelectedValues.slice();
  let currentAction = action;

  let currentSelectedValue: LegoSelectedValue = selectedValues
    .filter(value => value.id == currentAction.name)
    .shift();

  if (!currentSelectedValue) {
    currentSelectedValue = new LegoSelectedValue();
    selectedValues.push(currentSelectedValue);
  }

  currentSelectedValue.id = currentAction.name;

  let legoSelectedValueEntry: LegoSelectedValueEntry = currentSelectedValue.entries
    .filter(entry => entry.user == user)
    .shift();

  if (!legoSelectedValueEntry) {
    legoSelectedValueEntry = new LegoSelectedValueEntry();
    currentSelectedValue.entries.push(legoSelectedValueEntry);
  }

  legoSelectedValueEntry.user = user;
  legoSelectedValueEntry.value = currentAction.selected_options[0].value;

  return selectedValues;
}

function defaultErrorHandling(err: Error): void {
  console.error(err);
}

const legoSelectionHandler = (controller): void => {
  function attachmentsToSend(
    legoSelectedValues: LegoSelectedValue[],
    message: SlackMessage
  ): SlackAttachment[] {
    // @ts-ignore
    const reply: SlackMessage = message.original_message;

    let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
      attachment => attachment.callback_id === 'lego_stats'
    );
    attachmentsToSend.push({
      text: `${formatMessage(legoSelectedValues)}`,
    });

    return attachmentsToSend;
  }

  controller.middleware.receive.use(
    (bot: SlackBot, message, next: NextFunction) => {
      if (message.type == 'interactive_message_callback' && message.actions) {
        if (message.actions[0].name.match(/^lego-select-option-/)) {
          let fullMessageId: string = `${message.channel}_${
            message.original_message.ts
          }`;

          controller.storage.lego_messages.get(
            fullMessageId,
            (err: Error, storedLegoMessage: LegoMessage) => {
              if (err) {
                defaultErrorHandling(err);
              } else {
                const legoMessage = createLegoMessage({
                  legoMessage: storedLegoMessage,
                  fullMessageId,
                  user: message.user,
                  action: message.actions[0],
                  channel: message.channel,
                });

                controller.storage.lego_messages.save(legoMessage, err =>
                  defaultErrorHandling(err)
                );

                const reply: SlackMessage = message.original_message;
                reply.attachments = attachmentsToSend(
                  legoMessage.selectedValues,
                  message
                );
                bot.replyInteractive(message, reply);
              }
            }
          );
        }
      }

      next();
    }
  );
};
module.exports = legoSelectionHandler;
