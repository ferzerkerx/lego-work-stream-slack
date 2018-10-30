import { SlackBot, SlackMessage } from 'botkit';
import { NextFunction } from 'express';
import { LegoSelectionReplyService } from '../lego/Types';
import { Container } from '../Container';

function getLegoSelectionReplyService(): LegoSelectionReplyService {
  return Container.resolve<LegoSelectionReplyService>(
    'legoSelectionReplyService'
  );
}

const legoSelectionInteractiveHandler = (controller): void => {
  controller.middleware.receive.use(
    (bot: SlackBot, message, next: NextFunction) => {
      if (message.type == 'interactive_message_callback' && message.actions) {
        if (message.actions[0].name.match(/^lego-select-option-/)) {
          getLegoSelectionReplyService()
            .createReply(message)
            .then((reply: SlackMessage) => {
              bot.replyInteractive(message, reply);
            });
        }
      }

      next();
    }
  );
};
module.exports = legoSelectionInteractiveHandler;
