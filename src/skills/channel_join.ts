module.exports = controller => {
  controller.on('bot_channel_join', (bot, message) => {
    bot.reply(
      message,
      'Hello, Thanks for inviting me! I will be helping you to gather some metrics for the team. Try me just mention legos'
    );
  });
};
