var debug = require('debug')('botkit:channel_join');

module.exports = function(controller) {

    controller.on('bot_channel_join', function(bot, message) {
        debug(`bot_channel_join ${message.user} ${message.channel} ${message}`);
    });

}
