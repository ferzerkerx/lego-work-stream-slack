import { LegoMetricsService } from './LegoMetricsService';

describe('LegoMetricsService', () => {
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
