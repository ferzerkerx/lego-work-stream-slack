import { DateUtils } from './DateUtils';

describe('DateUtils', () => {
  test('toPrettyDate', () => {
    const date = new Date('2018-10-10');
    const dateStr = DateUtils.toPrettyDate(date.toDateString());
    expect(dateStr).toMatchSnapshot();
  });

  test('add', () => {
    const date = new Date('2018-10-10');
    const resultDate = DateUtils.add(date, 2);
    expect(resultDate).toMatchSnapshot();
  });

  test('should parse valid date', () => {
    const resultDate = DateUtils.parseDate('2018-10-10');
    expect(resultDate).toMatchSnapshot();
  });

  test('should not parse invalid date', () => {
    const resultDate = DateUtils.parseDate('not a date');
    expect(resultDate).toBeNull();
  });
});
