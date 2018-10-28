import * as debug from 'debug';
import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';

const log = debug('botkit:incoming_webhooks');

const processIncomingHooks = (
  webserver: Express,
  controller: SlackController
): void => {
  log('Configured /slack/receive url');
  webserver.post('/slack/receive', (req: Request, res: Response) => {
    res.status(200);

    // @ts-ignore
    controller.handleWebhookPayload(req, res);
  });
};

module.exports = processIncomingHooks;
