import { LegoMessageConfig, LegoMessageFactory } from './LegoMessageFactory';

describe('LegoMessageFactory', () => {
  test('should create message with valid structure', () => {
    // @ts-ignore
    const storage: Storage<LegoMessageConfig> = {
      team_configurations: {
        find: query => {
          return Promise.resolve({
            actionDescriptors: [
              { name: 'green', text: 'Green' },
              { name: 'red', text: 'Red' },
              { name: 'orange', text: 'Orange' },
              { name: 'black', text: 'Black' },
            ],
            min: 0,
            max: 8,
          });
        },
      },
      catch: error => {
        console.log(error);
      },
    };

    LegoMessageFactory.createMessage(
      storage,
      'someChannel',
      new Date('2018-10-01')
    ).then(message => {
      expect(message).toMatchSnapshot();
    });
  });
});
