import { SlackAttachment, SlackBot, SlackMessage, Storage } from 'botkit';
import { NextFunction } from 'express';
import { LegoSelectedValue } from '../lego/LegoSelectedValue';
import { LegoSelectMessage } from '../lego/LegoSelectMessage';
import { LegoSelectionService } from '../lego/LegoSelectionService';

class LegoSelectionReplyService {
  static createReply(message, storage:Storage<LegoSelectMessage>): Promise<SlackMessage> {
    let fullMessageId: string = this.getMessageId(message);

    // @ts-ignore
    return storage.lego_messages
      .get(fullMessageId)
      .then((storedLegoMessage: LegoSelectMessage) => {
        const legoMessage = LegoSelectionService.createLegoSelectMessage({
          legoMessage: storedLegoMessage,
          fullMessageId,
          user: message.user,
          action: message.actions[0],
          channel: message.channel,
        });

        // @ts-ignore
        return storage.lego_messages.save(legoMessage).then(() => {
          return this._createReply(message, legoMessage);
        });
      })
      .catch(e => this.defaultErrorHandling(e));
  }

  private static getMessageId(message): string {
    return `${message.channel}_${message.original_message.ts}`;
  }

  private static _createReply(
    message,
    legoMessage: LegoSelectMessage
  ): SlackMessage {
    const reply: SlackMessage = message.original_message;

    let attachmentsToSend: SlackAttachment[] = reply.attachments.filter(
      attachment => attachment.callback_id === 'lego_stats'
    );
    attachmentsToSend.push({
      text: `${this.formatSelectedValues(legoMessage.selectedValues)}`,
    });

    reply.attachments = attachmentsToSend;

    return reply;
  }

  static formatSelectedValues(legoSelectedValues: LegoSelectedValue[]): string {
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

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}

const legoSelectionHandler = (controller): void => {
  controller.middleware.receive.use(
    (bot: SlackBot, message, next: NextFunction) => {
      if (message.type == 'interactive_message_callback' && message.actions) {
        if (message.actions[0].name.match(/^lego-select-option-/)) {
          LegoSelectionReplyService.createReply(message, controller.storage).then(
            (reply: SlackMessage) => {
              bot.replyInteractive(message, reply);
            }
          );
        }
      }

      next();
    }
  );
};
module.exports = legoSelectionHandler;
