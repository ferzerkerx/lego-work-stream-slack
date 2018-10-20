import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/metrics/LegoMetricsService';
import { DateUtils } from '../../DateUtils';
import { Metrics } from '../../lego/metrics/Metrics';

const api = (webserver: Express, controller: SlackController): void => {
  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const config: MetricsConfiguration = MetricsConfigurationFactory.of(req);
    LegoMetricsService.metricsForConfig(
      // @ts-ignore
      controller.storage,
      config
    ).then((entry: Metrics) => {
      res.send(JSON.stringify(entry));
    });
  });
};

class MetricsConfigurationFactory {
  static of(req: Request): MetricsConfiguration {
    const starDate: Date = this.dateParam(req, 'startDate') || DateUtils.now();
    const endDate: Date =
      this.dateParam(req, 'endDate') || DateUtils.add(starDate, 1);
    const frequencyInDays: number = this.numberParam(req, 'frequency') || 15;
    const isPercentage: boolean =
      this.booleanParam(req, 'isPercentage') || false;
    const teams: [] = this.arrayParam(req, 'teams') || [];

    return {
      startDate: starDate,
      endDate: endDate,
      frequencyInDays: frequencyInDays,
      isPercentage: isPercentage,
      teams: teams,
    };
  }

  static dateParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    return DateUtils.parseDate(paramValue);
  }

  static numberParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    const result = Number(req.query[paramName]);
    if (isNaN(result)) {
      return null;
    }
    return result;
  }

  static booleanParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    return paramValue == 'true';
  }

  static arrayParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    if (!paramValue || paramValue.length == 0) {
      return null;
    }
    return paramValue.split(',');
  }
}

module.exports = api;
