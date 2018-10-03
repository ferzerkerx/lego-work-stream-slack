module.exports = controller => {
  // create special handlers for certain actions in buttons
  // if the button action is 'say', act as if user said that thing
  controller.middleware.receive.use((bot, message, next) => {
    if (message.type == 'interactive_message_callback') {
      if (message.actions[0].name.match(/^lego-select-option-/)) {
        const reply = message.original_message;

        // for (let a = 0; a < reply.attachments.length; a++) {
        //   reply.attachments[a].actions = null;
        // }
        if (message.actions) {
          let messageStr = '';
          for (let currentAction of message.actions) {
            for (let selectOption of currentAction.selected_options) {
              messageStr += `${currentAction.name} : ${selectOption.value}`
            }
          }

          console.log(`message: ${messageStr}`);

          // if (message.actions.length > 2) {
            let person = '<@' + message.user + '>';
            if (message.channel[0] == 'D') {
              person = 'You';
            }

            reply.attachments.push({
              text: `${person} said, ${messageStr}`,
            });

            bot.replyInteractive(message, reply);
          // }

        }
      }
    }

    next();
  });
};
