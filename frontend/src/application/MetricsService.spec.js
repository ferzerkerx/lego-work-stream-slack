import { MetricsService } from './MetricsService';

const fakeForm = () => {
  return {
    startDate: { value: '2018-10-01' },
    endDate: { value: '2018-10-01' },
    frequency: { value: 10 },
    isPercentage: { checked: true },
    teams: { value: 'team1,team2' },
  };
};

describe('MetricsService', () => {
  test('createConfiguration', () => {
    const configuration = MetricsService.createConfiguration(fakeForm());
    expect(configuration).toMatchSnapshot();
  });

  test('createUrl', () => {
    const configuration = MetricsService.createConfiguration(fakeForm());
    configuration.format = 'json';
    const url = MetricsService.createUrl(configuration);
    expect(url).toMatchSnapshot();
  });
});
