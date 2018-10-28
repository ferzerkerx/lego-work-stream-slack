import { LegoSelectionService, MessageContext } from './LegoSelectionService';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';

describe('LegoSelectionService', () => {
  test('createLegoSelectMessage without entries', () => {
    const storedLegoMessage: LegoSelectMessage = new LegoSelectMessage();
    storedLegoMessage.date = new Date('2018-10-01');

    const messageContext: MessageContext = {
      fullMessageId: 'someMessageId',
      userData: { userId: 'someUserId', userName: 'someuser' },
      action: { selected_options: [{ name: 'someActionName', value: 7 }] },
      channelData: { channelId: 'someChannelId', name: 'someChannel' },
    };

    const legoSelectMessage: LegoSelectMessage = LegoSelectionService.createLegoSelectMessage(
      {
        legoMessage: storedLegoMessage,
        messageContext: messageContext,
      }
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });

  test('createLegoSelectMessage with existing entries', () => {
    let selectedValues: LegoSelectedValue[] = [
      {
        id: 'someActionName',
        entries: [
          {
            userData: { userId: 'someUserId', userName: 'someuser' },
            value: 8,
          },
        ],
      },
      {
        id: 'someOtherActionName',
        entries: [
          {
            userData: { userId: 'someUserId', userName: 'someuser' },
            value: 6,
          },
        ],
      },
    ];

    const storedLegoMessage: LegoSelectMessage = {
      id: 'someMessageId',
      selectedValues: selectedValues,
      date: new Date('2018-10-01'),
      channelData: { channelId: 'someChannelId', name: 'someChannel' },
    };

    const messageContext: MessageContext = {
      fullMessageId: 'someMessageId',
      userData: { userId: 'someUserId', userName: 'someuser' },
      action: { selected_options: [{ name: 'someActionName', value: 7 }] },
      channelData: { channelId: 'someChannelId', name: 'someChannel' },
    };

    const legoSelectMessage: LegoSelectMessage = LegoSelectionService.createLegoSelectMessage(
      {
        legoMessage: storedLegoMessage,
        messageContext: messageContext,
      }
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });
});
