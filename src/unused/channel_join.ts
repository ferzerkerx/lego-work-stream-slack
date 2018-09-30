var debug = require('debug')('botkit:channel_join');

module.exports = controller => {
  controller.on('bot_channel_join', (bot, message) => {
    debug(`bot_channel_join ${message.user} ${message.channel} ${message}`);
  });
};
