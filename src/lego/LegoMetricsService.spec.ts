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
      id: 'someId',
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
    const entry: string = LegoMetricsService.toMetricsObject(
      givenLegoMessages()
    );
    expect(entry).toMatchSnapshot();
  });
});
