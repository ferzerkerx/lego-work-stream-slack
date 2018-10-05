import * as debug from 'debug';

const log = debug('botkit:incoming_webhooks');

module.exports = (webserver, controller) => {
  log('Configured /slack/receive url');
  webserver.post('/slack/receive', (req, res) => {
    res.status(200);

    req.type = 'event_callback';
    controller.handleWebhookPayload(req, res);
  });
};
