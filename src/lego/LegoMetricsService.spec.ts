import { LegoMetricsService } from './LegoMetricsService';
import { LegoSelectMessage } from './LegoSelectMessage';

function givenLegoMessages(): LegoSelectMessage[] {
  return [
    {
      id: 'someId',
      date: new Date('2018-10-10'),
      selectedValues: [
        {
          id: 'someKey',
          entries: [
            { userData: { userId: 'userOne', userName: 'userOne' }, value: 10 },
            { userData: { userId: 'userTwo', userName: 'userTwo' }, value: 5 },
          ],
        },
      ],
      channelData: { channelId: 'someChannel', name: 'name' },
    },
    {
      id: 'someCoolId',
      date: new Date('2018-10-10'),
      selectedValues: [
        {
          id: 'someKey',
          entries: [
            { userData: { userId: 'userOne', userName: 'userOne' }, value: 1 },
          ],
        },
        {
          id: 'someOtherKey',
          entries: [
            { userData: { userId: 'userOne', userName: 'userOne' }, value: 6 },
            {
              userData: { userId: 'userThree', userName: 'userThree' },
              value: 3,
            },
          ],
        },
      ],
      channelData: { channelId: 'someChannel', name: 'name' },
    },
    {
      id: 'someOtherId',
      date: new Date('2018-10-11'),
      selectedValues: [
        {
          id: 'someKey',
          entries: [
            { userData: { userId: 'userOne', userName: 'userOne' }, value: 2 },
            { userData: { userId: 'userTwo', userName: 'userTwo' }, value: 1 },
          ],
        },
        {
          id: 'someOtherKey',
          entries: [
            { userData: { userId: 'userOne', userName: 'userOne' }, value: 6 },
            {
              userData: { userId: 'userThree', userName: 'userThree' },
              value: 7,
            },
          ],
        },
      ],
      channelData: { channelId: 'someChannel', name: 'name' },
    },
  ];
}

describe('LegoMetricsService', () => {
  test('toMetricsObject', () => {
    const entry: any = LegoMetricsService.toMetricsObject(
      givenLegoMessages(),
      LegoMetricsService.toDatesArray(
        new Date('2018-10-10'),
        new Date('2018-10-11')
      )
    );
    expect(entry).toMatchSnapshot();
  });

  test('toDatesArray startdate only', () => {
    const entry: any = LegoMetricsService.toDatesArray(new Date('2018-10-10'));
    expect(entry).toMatchSnapshot();
  });

  test('toDatesArray startdate and endDate', () => {
    const entry: any = LegoMetricsService.toDatesArray(
      new Date('2018-10-10'),
      new Date('2018-10-15')
    );
    expect(entry).toMatchSnapshot();
  });
});
