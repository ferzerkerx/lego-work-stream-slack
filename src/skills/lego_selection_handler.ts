import { SlackAttachment, SlackBot, SlackMessage } from 'botkit';
import { NextFunction } from 'express';
import { LegoSelectedValue } from '../lego/LegoSelectedValue';
import { LegoSelectMessage } from '../lego/LegoSelectMessage';
import { LegoSelectionService } from '../lego/LegoSelectionService';

class LegoSelectionReplyService {
  static createReply(message, controller): Promise<any> {
    let fullMessageId: string = `${message.channel}_${
      message.original_message.ts
    }`;

    return controller.storage.lego_messages.get(
      fullMessageId).then((storedLegoMessage: LegoSelectMessage)=> {
      const legoMessage = LegoSelectionService.createLegoSelectMessage({
        legoMessage: storedLegoMessage,
        fullMessageId,
        user: message.user,
        action: message.actions[0],
        channel: message.channel,
      });

      return controller.storage.lego_messages.save(legoMessage).then(()=> {
        const reply: SlackMessage = message.original_message;
        reply.attachments = LegoSelectionReplyService.attachmentsToSend(
          legoMessage.selectedValues,
          message,
          reply.attachments
        );

        return reply;
      });
    });


    // controller.storage.lego_messages.get(
    //   fullMessageId,
    //   (err: Error, storedLegoMessage: LegoSelectMessage) => {
    //     if (err) {
    //       this.defaultErrorHandling(err);
    //     } else {
    //       const legoMessage = LegoSelectionService.createLegoSelectMessage({
    //         legoMessage: storedLegoMessage,
    //         fullMessageId,
    //         user: message.user,
    //         action: message.actions[0],
    //         channel: message.channel,
    //       });
    //
    //       controller.storage.lego_messages.save(legoMessage, err =>
    //         this.defaultErrorHandling(err)
    //       );
    //
    //       const reply: SlackMessage = message.original_message;
    //       reply.attachments = LegoSelectionReplyService.attachmentsToSend(
    //         legoMessage.selectedValues,
    //         message,
    //         reply.attachments
    //       );
    //
    //       return reply;
    //     }
    //   }
    // );
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

  static attachmentsToSend(
    legoSelectedValues: LegoSelectedValue[],
    message: SlackMessage,
    slackAttachments: SlackAttachment[]
  ): SlackAttachment[] {
    let attachmentsToSend: SlackAttachment[] = slackAttachments.filter(
      attachment => attachment.callback_id === 'lego_stats'
    );
    attachmentsToSend.push({
      text: `${this.formatSelectedValues(legoSelectedValues)}`,
    });

    return attachmentsToSend;
  }

  static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}

const legoSelectionHandler = (controller): void => {
  controller.middleware.receive.use(
    (bot: SlackBot, message, next: NextFunction) => {
      if (message.type == 'interactive_message_callback' && message.actions) {
        if (message.actions[0].name.match(/^lego-select-option-/)) {
          LegoSelectionReplyService.createReply(message, controller).then(
            reply => {bot.replyInteractive(message, reply)}
          );
        }
      }

      next();
    }
  );
};
module.exports = legoSelectionHandler;
