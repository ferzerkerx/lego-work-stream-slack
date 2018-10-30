import { ProcessStatistics } from './ProcessStatistics';

describe('ProcessStatistics', () => {
  test('formatUptime', () => {
    ProcessStatistics.triggers = 10;
    ProcessStatistics.convos = 40;

    const value = ProcessStatistics.formatUptime(100);
    expect(value).toMatchSnapshot();
  });
});
