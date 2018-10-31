import { LegoMetricsCalculator } from './LegoMetricsCalculator';
import { MetricsConfigurationFactory } from './MetricsConfigurationFactory';

describe('LegoMetricsCalculator', () => {
  test('calculate with periods', () => {
    let fakeRequest = {
      query: {
        startDate: new Date('2018-10-08'),
        endDate: new Date('2018-10-12'),
        frequencyInDays: 3,
        isPercentage: true,
        teams: 'team1,team2',
        format: 'csv',
      },
    };

    // @ts-ignore
    const metricsConfiguration = MetricsConfigurationFactory.of(fakeRequest);
    expect(metricsConfiguration).toMatchSnapshot();
  });
});
