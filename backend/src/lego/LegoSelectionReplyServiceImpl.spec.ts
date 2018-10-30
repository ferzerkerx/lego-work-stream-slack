import { LegoSelectedValue } from './LegoSelectedValue';
import { LegoSelectionReplyServiceImpl } from './LegoSelectionReplyServiceImpl';
import { LegoSelectMessageRepository } from './Types';
import { LegoSelectMessage } from './LegoSelectMessage';

describe('LegoSelectionReplyService', () => {
  test('formatMessage properly', () => {
    let selectedValues: LegoSelectedValue[] = [
      {
        id: 'someActionName',
        entries: [
          {
            userData: { userId: 'someuserId', userName: 'someuser' },
            value: 8,
          },
        ],
      },
      {
        id: 'someOtherActionName',
        entries: [
          {
            userData: { userId: 'someuserId', userName: 'someuser' },
            value: 6,
          },
        ],
      },
      {
        id: 'awesomeActionName',
        entries: [
          {
            userData: { userId: 'someuserId', userName: 'someuser' },
            value: 0,
          },
        ],
      },
    ];

    let actionMappings: any = {
      someActionName: { text: 'theActualName' },
      awesomeActionName: { text: 'CoolName' },
    };

    const legoSelectMessage: string = LegoSelectionReplyServiceImpl.formatSelectedValues(
      selectedValues,
      actionMappings
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });

  test('createReply', () => {
    const legoSelectionReplyServiceImpl = new LegoSelectionReplyServiceImpl(
      new FakeRepo()
    );
    const message = {
      ts: 12345,
      channel: 'channelName',
      original_message: {
        ts: 12345,
        attachments: [
          {
            callback_id: 'lego_stats',
            actions: [{ name: 'someActionName', text: 'someActionText' }],
          },
        ],
      },
      user: 'someUserId',
      raw_message: {
        user: { name: 'someuser' },
        channel: { name: 'channelName' },
      },
      actions: [{ name: 'someActionName', selected_options: [{ value: 8 }] }],
    };

    legoSelectionReplyServiceImpl.createReply(message).then(slackMessage => {
      expect(slackMessage).toMatchSnapshot();
    });
  });

  class FakeRepo implements LegoSelectMessageRepository {
    find(messageId: string): Promise<LegoSelectMessage> {
      const legoSelectMessage = new LegoSelectMessage();
      legoSelectMessage.selectedValues.push({
        id: 'someActionName',
        entries: [
          {
            userData: { userId: 'someUserId', userName: 'someuser' },
            value: 5,
          },
        ],
      });

      return Promise.resolve(legoSelectMessage);
    }

    findMessagesBy(config: MetricsConfiguration): Promise<LegoSelectMessage[]> {
      return Promise.resolve([]);
    }

    save(legoMessage: LegoSelectMessage): Promise<LegoSelectMessage> {
      return Promise.resolve(legoMessage);
    }
  }
});
