import { Request } from 'express';
import { DateUtils } from './DateUtils';

export class RequestUtils {
  static dateParam(req: Request, paramName: string): Date {
    const paramValue: string = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    return DateUtils.parseDate(paramValue);
  }

  static numberParam(req: Request, paramName: string): number {
    const paramValue: string = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    const result = Number(req.query[paramName]);
    if (isNaN(result)) {
      return null;
    }
    return result;
  }

  static stringParam(req: Request, paramName: string): string {
    const paramValue: string = req.query[paramName];
    if (!paramValue || paramValue === '') {
      return null;
    }
    return paramValue;
  }

  static booleanParam(req: Request, paramName: string): boolean {
    const paramValue: string = req.query[paramName];
    return paramValue == 'true';
  }

  static arrayParam(req: Request, paramName: string): Array<string> {
    const paramValue: string = req.query[paramName];
    if (!paramValue || paramValue.length == 0) {
      return null;
    }
    return paramValue.split(',');
  }
}
