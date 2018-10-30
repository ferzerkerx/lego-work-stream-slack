import { Utils } from './application/Utils';

describe('Utils', () => {

  test('toNumber', () => {
    const value = Utils.toNumber('02');
    expect(value).toMatchSnapshot();
  });

  test('toNumber invalid', () => {
    const value = Utils.toNumber('a');
    expect(value).toBeNull();
  });

  test('toArray invalid', () => {
    const value = Utils.toArray(null);
    expect(value).toBeNull();
  });

  test('toArray', () => {
    const value = Utils.toArray('1,2,3');
    expect(value).toMatchSnapshot();
  });

  test('toDateString', () => {
    const value = Utils.toDateString(new Date('2018-10-01'));
    expect(value).toMatchSnapshot();
  });

  test('addDays', () => {
    const value = Utils.addDays('2018-10-01');
    expect(value).toMatchSnapshot();
  });
});