import { SlackBot, SlackController, SlackMessage } from 'botkit';

function legoAction(name: string, text: string, values: number = 8): any {
  let options: any = [];
  for (let i: number = 0; i <= values; i++) {
    options.push({
      text: `${i}`,
      value: i,
    });
  }
  return {
    name: name,
    text: text,
    type: 'select',
    options: options,
  };
}

function toPrettyDate(theValue) {
  let theDate = new Date(theValue),
    month = '' + (theDate.getMonth() + 1),
    day = '' + theDate.getDate(),
    year = theDate.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  return [year, month, day].join('-');
}

function selectYourLegosMessage(): SlackMessage {
  const now = new Date();
  return {
    text: `Please select your Legos for today ${toPrettyDate(now)}`,
    attachments: [
      {
        text: 'Choose your legos!',
        fallback: 'Unable to set lego stats',
        callback_id: 'lego_stats',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          legoAction('lego-select-option-green', 'Green'),
          legoAction('lego-select-option-red', 'Red'),
          legoAction('lego-select-option-orange', 'Orange'),
          legoAction('lego-select-option-black', 'Black'),
        ],
      },
    ],
  };
}

const legoMentionHandler = (controller: SlackController): void => {
  controller.hears(
    'lego',
    'direct_mention',
    (bot: SlackBot, message: SlackMessage) => {
      bot.reply(message, selectYourLegosMessage());
    }
  );
};
module.exports = legoMentionHandler;
