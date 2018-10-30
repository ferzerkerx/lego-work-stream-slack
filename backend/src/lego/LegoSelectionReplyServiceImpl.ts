import { SlackAttachment, SlackMessage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectionService } from './LegoSelectionService';
import { LegoSelectedValue } from './LegoSelectedValue';
import { ErrorUtil } from '../utils/ErrorUtil';
import {
  LegoSelectionReplyService,
  LegoSelectMessageRepository,
} from './Types';

export class LegoSelectionReplyServiceImpl
  implements LegoSelectionReplyService {
  constructor(
    private legoSelectMessageRepository: LegoSelectMessageRepository
  ) {}

  createReply(message): Promise<SlackMessage | void> {
    let fullMessageId: string = LegoSelectionReplyServiceImpl.getMessageId(
      message
    );

    return this.legoSelectMessageRepository
      .find(fullMessageId)
      .then((storedLegoMessage: LegoSelectMessage) => {
        const legoMessage = LegoSelectionService.createLegoSelectMessage({
          legoMessage: storedLegoMessage,
          messageContext: {
            fullMessageId,
            userData: {
              userId: message.user,
              userName: message.raw_message.user.name,
            },
            action: message.actions[0],
            channelData: {
              channelId: message.channel,
              name: message.raw_message.channel.name,
            },
          },
        });

        return this.legoSelectMessageRepository.save(legoMessage).then(() => {
          return LegoSelectionReplyServiceImpl._createReply(
            message,
            legoMessage
          );
        });
      })
      .catch(e => ErrorUtil.defaultErrorHandling(e));
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
      actionMappings[actionDetail.name] = { text: actionDetail.text };
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
      let entriesStr: string = legoSelectedValue.entries
        .filter(entry => entry.value > 0)
        .map(entry => `<@${entry.userData.userId}>:${entry.value}`)
        .join(',');

      const actionDisplayName = actionMappings[legoSelectedValue.id]
        ? actionMappings[legoSelectedValue.id].text
        : legoSelectedValue.id;
      if (entriesStr.length > 0) {
        messageStr += `${actionDisplayName}: ${entriesStr}\n`;
      }
    }
    return messageStr;
  }
}
