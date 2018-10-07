import { LegoMessageConfig, LegoMessageFactory } from './LegoMessageFactory';
import { SlackMessage } from 'botkit';

describe('LegoMessageFactory', () => {
  test('should create message with valid structure', () => {
    let config: LegoMessageConfig = {
      actionDescriptors: [
        { name: 'green', text: 'Green' },
        { name: 'red', text: 'Red' },
        { name: 'orange', text: 'Orange' },
        { name: 'black', text: 'Black' },
      ],
      min: 0,
      max: 8,
    };
    const message: SlackMessage = LegoMessageFactory.createMessage(
      config,
      new Date('2018-10-01')
    );
    expect(message).toMatchSnapshot();
  });
});
