import { RequestUtils } from './RequestUtils';

describe('RequestUtils', () => {
  function fakeRequest(paramName, value): any {
    const result = {
      query: {},
    };
    result.query[paramName] = value;
    return result;
  }

  test('dateParam', () => {
    const paramName = 'dateParam';
    const req = fakeRequest(paramName, '2018-10-10');
    const value = RequestUtils.dateParam(req, paramName);
    expect(value).toMatchSnapshot();
  });

  test('invalid dateParam', () => {
    const paramName = 'dateParam';
    const req = fakeRequest(paramName, '2018-10-10');
    const value = RequestUtils.dateParam(req, 'someOtherName');
    expect(value).toBeNull();
  });

  test('numberParam', () => {
    const paramName = 'numberParam';
    const req = fakeRequest(paramName, '02');
    const value = RequestUtils.numberParam(req, paramName);
    expect(value).toMatchSnapshot();
  });

  test('invalid numberParam', () => {
    const paramName = 'numberParam';
    const req = fakeRequest(paramName, '02');
    const value = RequestUtils.numberParam(req, 'someOtherName');
    expect(value).toBeNull();
  });

  test('stringParam', () => {
    const paramName = 'stringParam';
    const req = fakeRequest(paramName, 'someValue');
    const value = RequestUtils.stringParam(req, paramName);
    expect(value).toMatchSnapshot();
  });

  test('invalid stringParam', () => {
    const paramName = 'stringParam';
    const req = fakeRequest(paramName, 'someValue');
    const value = RequestUtils.stringParam(req, 'someOtherName');
    expect(value).toBeNull();
  });

  test('arrayParam', () => {
    const paramName = 'arrayParam';
    const req = fakeRequest(paramName, 'value1, value2');
    const value = RequestUtils.arrayParam(req, paramName);
    expect(value).toMatchSnapshot();
  });

  test('invalid arrayParam', () => {
    const paramName = 'arrayParam';
    const req = fakeRequest(paramName, 'value1, value2');
    const value = RequestUtils.arrayParam(req, 'someOtherName');
    expect(value).toBeNull();
  });

  test('booleanParam', () => {
    const paramName = 'booleanParam';
    const req = fakeRequest(paramName, 'true');
    const value = RequestUtils.arrayParam(req, paramName);
    expect(value).toMatchSnapshot();
  });

  test('invalid booleanParam', () => {
    const paramName = 'booleanParam';
    const req = fakeRequest(paramName, 'someValue');
    const value = RequestUtils.arrayParam(req, 'someOtherName');
    expect(value).toBeFalsy();
  });
});
