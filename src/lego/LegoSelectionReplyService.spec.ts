import { LegoSelectionReplyService } from './LegoSelectionReplyService';
import { LegoSelectedValue } from './LegoSelectedValue';

describe('LegoSelectionReplyService', () => {
  test('formatMessage properly', () => {
    let selectedValues: LegoSelectedValue[] = [
      {
        id: 'someActionName',
        entries: [{ user: 'someuser', value: 8 }],
      },
      {
        id: 'someOtherActionName',
        entries: [{ user: 'someuser', value: 6 }],
      },
      {
        id: 'awesomeActionName',
        entries: [{ user: 'someuser', value: 0 }],
      },
    ];

    let actionMappings: any = {
      someActionName: { text: 'theActualName' },
      awesomeActionName: { text: 'CoolName' },
    };

    const legoSelectMessage: string = LegoSelectionReplyService.formatSelectedValues(
      selectedValues,
      actionMappings
    );
    expect(legoSelectMessage).toMatchSnapshot();
  });
});
