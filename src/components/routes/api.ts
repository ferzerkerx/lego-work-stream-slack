import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/LegoMetricsService';
import { LegoSelectMessage } from '../../lego/LegoSelectMessage';
import { Utils } from '../../Utils';

const api = (webserver: Express, controller: SlackController): void => {
  function dateParam(req: Request, paramName: string) {
    const paramValue = req.query[paramName];
    if (!paramValue) {
      return null;
    }
    const date: Date = new Date(paramValue);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const starDate = dateParam(req, 'startDate') || Utils.now();
    const endDate = dateParam(req, 'endDate') || Utils.add(Utils.now(), 1);

    LegoMetricsService.metricsForDate(
      // @ts-ignore
      controller.storage,
      starDate,
      endDate
    ).then((messages: LegoSelectMessage) => {
      res.send(JSON.stringify(messages));
    });
  });
};

module.exports = api;
