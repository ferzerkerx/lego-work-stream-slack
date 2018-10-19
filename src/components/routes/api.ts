import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/LegoMetricsService';
import { DateUtils } from '../../DateUtils';
import { MetricEntry } from '../../lego/LegoMetricsCalculator';

const api = (webserver: Express, controller: SlackController): void => {
  function dateParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    return DateUtils.parseDate(paramValue);
  }

  function numberParam(req: Request, paramName: string) {
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

  function metricsConfiguration(req: Request): MetricsConfiguration {
    const starDate: Date = dateParam(req, 'startDate') || DateUtils.now();
    const endDate: Date =
      dateParam(req, 'endDate') || DateUtils.add(starDate, 1);
    const frequencyInDays: number = numberParam(req, 'frequency') || 15;

    return {
      startDate: starDate,
      endDate: endDate,
      frequencyInDays: frequencyInDays,
      isPercentage: true,
    };
  }

  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const config: MetricsConfiguration = metricsConfiguration(req);
    LegoMetricsService.metricsForConfig(
      // @ts-ignore
      controller.storage,
      config
    ).then((entry: MetricEntry) => {
      res.send(JSON.stringify(entry));
    });
  });
};

module.exports = api;
