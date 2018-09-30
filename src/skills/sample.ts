module.exports = function(controller) {
  controller.hears('hello', 'direct_mention,direct_message', function(
    bot,
    message
  ) {
    bot.reply(message, 'Howdy!');
  });
};
