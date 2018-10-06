import { Express, Request, Response, NextFunction } from 'express';
import { SlackController } from 'botkit';

const middleWare = (webserver: Express, controller: SlackController): void => {
  webserver.use((req: Request, res: Response, next: NextFunction) => {
    next();
  });
};
module.exports = middleWare;
