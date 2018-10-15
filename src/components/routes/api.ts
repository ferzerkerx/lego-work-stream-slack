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

  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const starDate = dateParam(req, 'startDate') || DateUtils.now();
    const endDate = dateParam(req, 'endDate') || DateUtils.add(DateUtils.now(), 1);

    const config:any = {
      starDate: starDate,
      endDate: endDate,
    };
    LegoMetricsService.metricsForDate(
      // @ts-ignore
      controller.storage,
      config
    ).then((messages: LegoSelectMessage) => {
      res.send(JSON.stringify(messages));
    });
  });
};

module.exports = api;
