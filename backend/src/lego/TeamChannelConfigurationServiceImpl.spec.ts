import { TeamChannelConfigurationServiceImpl } from './TeamChannelConfigurationServiceImpl';

function expectInvalidConfiguration(jsonConfig) {
  const configStr: string = JSON.stringify(jsonConfig);

  const configuration = TeamChannelConfigurationServiceImpl.parseConfig(
    configStr,
  );
  expect(configuration).toBeNull();
}

describe('TeamChannelConfigurationServiceImpl', () => {
  test('parseConfig Invalid json', () => {
    const jsonConfig: string = 'invalidJSON';

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig invalid actionDescriptors', () => {
    const jsonConfig = {
      actionDescriptors: [{ name: '', text: '' }],
      min: 0,
      max: 8,
    };

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig empty actionDescriptors', () => {
    const jsonConfig = {
      actionDescriptors: [],
      min: 0,
      max: 8,
    };

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig invalid max', () => {
    const jsonConfig = {
      actionDescriptors: [],
      min: 0,
      max: -19.6,
    };

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig invalid min', () => {
    const jsonConfig = {
      actionDescriptors: [],
      min: -19.6,
      max: 19,
    };

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig invalid range', () => {
    const jsonConfig = {
      actionDescriptors: [],
      min: 20,
      max: 19,
    };

    expectInvalidConfiguration(jsonConfig);
  });

  test('parseConfig valid', () => {
    const jsonConfig = {
      actionDescriptors: [
        { name: 'green', text: 'Green' },
        { name: 'red', text: 'Red' },
        { name: 'orange', text: 'Orange' },
        { name: 'black', text: 'Black' },
      ],
      min: 0,
      max: 8,
    };

    const configStr: string = JSON.stringify(jsonConfig);

    const configuration = TeamChannelConfigurationServiceImpl.parseConfig(
      configStr
    );
    expect(configuration).toMatchSnapshot();
  });
});
