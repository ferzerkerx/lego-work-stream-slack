import {SlackController} from "botkit";

var debug = require('debug')('botkit:incoming_webhooks');

module.exports = (webserver, controller: SlackController) => {
  debug('Configured /slack/receive url');
  webserver.post('/slack/receive', (req, res) => {
    // NOTE: we should enforce the token check here

    // respond to Slack that the webhook has been received.
    res.status(200);

    // Now, pass the webhook into be processed
    // controller.handleWebhookPayload(req, res);
  });
};