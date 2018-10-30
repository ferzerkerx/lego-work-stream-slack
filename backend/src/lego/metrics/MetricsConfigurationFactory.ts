import { Request } from 'express';
import { RequestUtils } from '../../utils/RequestUtils';
import { DateUtils } from '../../utils/DateUtils';

export class MetricsConfigurationFactory {
  static of(req: Request): MetricsConfiguration {
    const starDate: Date =
      RequestUtils.dateParam(req, 'startDate') || DateUtils.now();
    const endDate: Date =
      RequestUtils.dateParam(req, 'endDate') || DateUtils.add(starDate, 1);
    const frequencyInDays: number =
      RequestUtils.numberParam(req, 'frequency') || 15;
    const isPercentage: boolean =
      RequestUtils.booleanParam(req, 'isPercentage') || false;
    const teams: string[] = RequestUtils.arrayParam(req, 'teams') || [];
    const format: string = RequestUtils.stringParam(req, 'format') || 'json';

    return {
      startDate: starDate,
      endDate: endDate,
      frequencyInDays: frequencyInDays,
      isPercentage: isPercentage,
      teams: teams,
      format: format,
    };
  }
}
