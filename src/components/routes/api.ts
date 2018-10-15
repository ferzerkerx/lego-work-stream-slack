import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/LegoMetricsService';
import { LegoSelectMessage } from '../../lego/LegoSelectMessage';
import { DateUtils } from '../../DateUtils';

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

  function metricsConfiguration(req: Request) {
    const starDate = dateParam(req, 'startDate') || DateUtils.now();
    const endDate =
      dateParam(req, 'endDate') || DateUtils.add(DateUtils.now(), 1);
    const frequencyInDays = numberParam(req, 'frequency') || 15;

    return {
      starDate: starDate,
      endDate: endDate,
      frequencyInDays: frequencyInDays,
    };
  }

  webserver.get('/api/metrics', (req: Request, res: Response) => {
    LegoMetricsService.metricsForConfig(
      // @ts-ignore
      controller.storage,
      metricsConfiguration(req)
    ).then((messages: LegoSelectMessage) => {
      res.send(JSON.stringify(messages));
    });
  });
};

module.exports = api;
