import { SlackAttachment, SlackMessage, Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectionService } from './LegoSelectionService';
import { LegoSelectedValue } from './LegoSelectedValue';

export class LegoSelectionReplyService {
  static createReply(
    message,
    storage: Storage<LegoSelectMessage>
  ): Promise<SlackMessage> {
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

    let actionMappings: any = {};
    attachmentsToSend[0].actions.forEach(actionDetail => {
      actionMappings[actionDetail.name] = actionDetail.text;
    });

    attachmentsToSend.push({
      text: `${this.formatSelectedValues(
        legoMessage.selectedValues,
        actionMappings
      )}`,
    });

    reply.attachments = attachmentsToSend;

    return reply;
  }

  static formatSelectedValues(
    legoSelectedValues: LegoSelectedValue[],
    actionMappings: any
  ): string {
    let messageStr: string = '';

    for (let legoSelectedValue of legoSelectedValues) {
      messageStr += `${actionMappings[legoSelectedValue.id] ||
        legoSelectedValue.id}: `;
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
