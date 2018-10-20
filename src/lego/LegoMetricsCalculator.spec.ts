import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoMetricsCalculator } from './LegoMetricsCalculator';

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

describe('LegoMetricsCalculator', () => {
  test('calculate', () => {
    let config: MetricsConfiguration = {
      startDate: new Date('2018-10-10'),
      endDate: new Date('2018-10-11'),
      frequencyInDays: 1,
    };

    const entry: any = LegoMetricsCalculator.calculate(
      givenLegoMessages(),
      config
    );
    expect(entry).toMatchSnapshot();
  });

  test('calculate with periods', () => {
    let config: MetricsConfiguration = {
      startDate: new Date('2018-10-08'),
      endDate: new Date('2018-10-12'),
      frequencyInDays: 3,
    };

    const entry: any = LegoMetricsCalculator.calculate(
      givenLegoMessages(),
      config
    );
    expect(entry).toMatchSnapshot();
  });
});
