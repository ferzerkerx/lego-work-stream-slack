import {
  TeamChannelConfiguration,
  LegoMessageFactory,
} from './LegoMessageFactory';

describe('LegoMessageFactory', () => {
  test('should create message with valid structure', () => {
    const config: TeamChannelConfiguration = {
      actionDescriptors: [
        { name: 'green', text: 'Green' },
        { name: 'red', text: 'Red' },
        { name: 'orange', text: 'Orange' },
        { name: 'black', text: 'Black' },
      ],
      min: 0,
      max: 8,
      channelName: 'someChannel',
      id: 'someChannel',
    };

    const message = LegoMessageFactory.createMessage(
      config,
      new Date('2018-10-01')
    );

    expect(message).toMatchSnapshot();
  });
});
