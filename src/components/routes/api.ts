import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { LegoMetricsService } from '../../lego/LegoMetricsService';
import { LegoSelectMessage } from '../../lego/LegoSelectMessage';

const api = (webserver: Express, controller: SlackController): void => {
  webserver.get('/api/metrics', (req: Request, res: Response) => {
    LegoMetricsService.metricsForDate(
      // @ts-ignore
      controller.storage,
      new Date('2018-10-07')
    ).then((messages: LegoSelectMessage) => {
      res.send(JSON.stringify(messages));
    });
  });
};

module.exports = api;
