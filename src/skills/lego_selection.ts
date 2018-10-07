import { SlackBot, SlackController, SlackMessage } from 'botkit';
import {
  LegoMessageConfig,
  LegoMessageFactory,
} from '../lego/LegoMessageFactory';

const legoMentionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, message: SlackMessage) => {
      let defaultConfig: LegoMessageConfig = {
        //TODO  retrieve this config from db
        date: new Date('2018-10-01'),
        actionDescriptors: [
          { name: 'green', text: 'Green' },
          { name: 'red', text: 'Red' },
          { name: 'orange', text: 'Orange' },
          { name: 'black', text: 'Black' },
        ],
        min: 0,
        max: 8,
      };

      bot.reply(message, LegoMessageFactory.createMessage(defaultConfig));
    }
  );
};
module.exports = legoMentionHandler;
