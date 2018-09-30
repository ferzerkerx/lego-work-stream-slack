module.exports = controller => {
  controller.hears('hello', 'direct_mention,direct_message', (bot, message) => {
    bot.reply(message, 'Howdy!');
  });
};
