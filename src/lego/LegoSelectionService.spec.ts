import { LegoSelectionService } from './LegoSelectionService';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';

describe('LegoSelectionService', () => {
  test('createLegoSelectMessage without entries', () => {
    const storedLegoMessage: LegoSelectMessage = new LegoSelectMessage();
    storedLegoMessage.date = new Date('2018-10-01');

    const legoSelectMessage: LegoSelectMessage = LegoSelectionService.createLegoSelectMessage(
      {
        legoMessage: storedLegoMessage,
        fullMessageId: 'someMessageId',
        user: 'someuser',
        action: { selected_options: [{ name: 'someActionName', value: 7 }] },
        channel: 'someChannel',
      }
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });

  test('createLegoSelectMessage with existing entries', () => {
    let selectedValues: LegoSelectedValue[] = [
      {
        id: 'someActionName',
        entries: [{ user: 'someuser', value: 8 }],
      },
      {
        id: 'someOtherActionName',
        entries: [{ user: 'someuser', value: 6 }],
      },
    ];

    const storedLegoMessage: LegoSelectMessage = {
      id: 'someMessageId',
      selectedValues: selectedValues,
      date: new Date('2018-10-01'),
      channel: 'someChannel',
    };

    const legoSelectMessage: LegoSelectMessage = LegoSelectionService.createLegoSelectMessage(
      {
        legoMessage: storedLegoMessage,
        fullMessageId: 'someMessageId',
        user: 'someuser',
        action: { name: 'someActionName', selected_options: [{ value: 7 }] },
        channel: 'someChannel',
      }
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });
});
