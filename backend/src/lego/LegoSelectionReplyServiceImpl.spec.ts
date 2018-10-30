import { LegoSelectedValue } from './LegoSelectedValue';
import { LegoSelectionReplyServiceImpl } from './LegoSelectionReplyServiceImpl';

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
});
