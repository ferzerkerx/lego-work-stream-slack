var debug = require('debug')('botkit:incoming_webhooks');

module.exports = (webserver, controller) => {
  debug('Configured /slack/receive url');
  webserver.post('/slack/receive', (req, res) => {
    // NOTE: we should enforce the token check here
    const payload = req.body;
    console.log(payload.token);

    // respond to Slack that the webhook has been received.
    res.status(200);

    // Now, pass the webhook into be processed
    req.type = 'event_callback';

    console.log(JSON.stringify(payload))
    controller.handleWebhookPayload(req, res);
  });
};
