import { SlackBot, SlackMessage } from 'botkit';
import { NextFunction } from 'express';
import { LegoSelectionReplyService } from '../lego/LegoSelectionReplyService';

const legoSelectionInteractiveHandler = (controller): void => {
  controller.middleware.receive.use(
    (bot: SlackBot, message, next: NextFunction) => {
      if (message.type == 'interactive_message_callback' && message.actions) {
        if (message.actions[0].name.match(/^lego-select-option-/)) {
          LegoSelectionReplyService.createReply(
            message,
            controller.storage
          ).then((reply: SlackMessage) => {
            bot.replyInteractive(message, reply);
          });
        }
      }

      next();
    }
  );
};
module.exports = legoSelectionInteractiveHandler;
