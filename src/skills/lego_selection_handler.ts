import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';
import { NextFunction } from 'express';
import { LegoSelectedValue } from '../lego/LegoSelectedValue';
import { LegoSelectMessage } from '../lego/LegoSelectMessage';
import { LegoSelectionService } from '../lego/LegoSelectionService';

function formatSelectedValues(legoSelectedValues: LegoSelectedValue[]): string {
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
      text: `${formatSelectedValues(legoSelectedValues)}`,
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
            (err: Error, storedLegoMessage: LegoSelectMessage) => {
              if (err) {
                defaultErrorHandling(err);
              } else {
                const legoMessage = LegoSelectionService.createLegoSelectMessage(
                  {
                    legoMessage: storedLegoMessage,
                    fullMessageId,
                    user: message.user,
                    action: message.actions[0],
                    channel: message.channel,
                  }
                );

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
