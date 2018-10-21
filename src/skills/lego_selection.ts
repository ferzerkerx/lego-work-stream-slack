import { SlackBot, SlackController, SlackMessage } from 'botkit';
import {
  LegoMessageConfig,
  LegoMessageFactory,
} from '../lego/LegoMessageFactory';

const legoSelectionHandler = (controller: SlackController): void => {
  function defaultConfiguration(): LegoMessageConfig {
    return {
      //TODO  retrieve this config from db
      actionDescriptors: [
        { name: 'green', text: 'Green' },
        { name: 'red', text: 'Red' },
        { name: 'orange', text: 'Orange' },
        { name: 'black', text: 'Black' },
      ],
      min: 0,
      max: 8,
    };
  }

  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, message: SlackMessage) => {
      let configuration: LegoMessageConfig = defaultConfiguration();

      bot.reply(
        message,
        LegoMessageFactory.createMessage(configuration, new Date())
      );
    }
  );
};
module.exports = legoSelectionHandler;
