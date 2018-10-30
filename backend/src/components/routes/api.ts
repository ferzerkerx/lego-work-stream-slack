import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/metrics/LegoMetricsService';
import { DateUtils } from '../../utils/DateUtils';
import { Metrics } from '../../lego/metrics/Metrics';
import { CsvUtils } from '../../utils/CsvUtils';
import { Container } from '../../Container';

const api = (webserver: Express, controller: SlackController): void => {
  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const config: MetricsConfiguration = MetricsConfigurationFactory.of(req);
    const legoMetricsService: LegoMetricsService = Container.resolve<
      LegoMetricsService
    >('legoMetricsService');
    legoMetricsService.metricsForConfig(config).then((entry: Metrics) => {
      if (config.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="metrics.csv"'
        );
        res.send(CsvUtils.toCsv(entry.csvData()));
      } else {
        res.send(JSON.stringify(entry));
      }
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
    const teams: string[] = this.arrayParam(req, 'teams') || [];
    const format: string = this.stringParam(req, 'format') || 'json';

    return {
      startDate: starDate,
      endDate: endDate,
      frequencyInDays: frequencyInDays,
      isPercentage: isPercentage,
      teams: teams,
      format: format,
    };
  }

  static dateParam(req: Request, paramName: string) {
    const paramValue: string = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    return DateUtils.parseDate(paramValue);
  }

  static numberParam(req: Request, paramName: string) {
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

  static stringParam(req: Request, paramName: string) {
    const paramValue: string = req.query[paramName];
    if (!paramValue || paramValue === '') {
      return null;
    }
    return paramValue;
  }

  static booleanParam(req: Request, paramName: string) {
    const paramValue: string = req.query[paramName];
    return paramValue == 'true';
  }

  static arrayParam(req: Request, paramName: string) {
    const paramValue: string = req.query[paramName];
    if (!paramValue || paramValue.length == 0) {
      return null;
    }
    return paramValue.split(',');
  }
}

module.exports = api;
