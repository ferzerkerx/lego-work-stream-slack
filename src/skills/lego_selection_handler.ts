import {SlackAttachment, SlackBot, SlackMessage} from 'botkit';
import {NextFunction} from 'express';

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

  function updateLegoMessage(storedLegoMessage: LegoMessage = new LegoMessage(), message, fullMessageId: string) {
    let selectedValues: LegoSelectedValue[] = updateLegoSelectedValues(
      storedLegoMessage.selectedValues || [],
      message
    );

    return {
      id: fullMessageId,
      selectedValues: selectedValues,
      channel: message.channel,
    };
  }


  function updateLegoSelectedValues(
    currentSelectedValues: LegoSelectedValue[] = [],
    message
  ): LegoSelectedValue[] {
    let selectedValues: LegoSelectedValue[] = currentSelectedValues.slice();
    let currentAction = message.actions[0];

    let currentSelectedValue: LegoSelectedValue = selectedValues
      .filter(value => value.id == currentAction.name)
      .shift();

    if (!currentSelectedValue) {
      currentSelectedValue = new LegoSelectedValue();
      selectedValues.push(currentSelectedValue);
    }

    currentSelectedValue.id = currentAction.name;

    let legoSelectedValueEntry: LegoSelectedValueEntry = currentSelectedValue.entries
      .filter(entry => entry.user == message.user)
      .shift();

    if (!legoSelectedValueEntry) {
      legoSelectedValueEntry = new LegoSelectedValueEntry();
      currentSelectedValue.entries.push(legoSelectedValueEntry);
    }

    legoSelectedValueEntry.user = message.user;
    legoSelectedValueEntry.value = currentAction.selected_options[0].value;

    return selectedValues;
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
                const legoMessage = updateLegoMessage(storedLegoMessage, message, fullMessageId);

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
