import {SlackMessage} from "botkit";

function legoMessage() : SlackMessage {
  return {
    "text": "Please Select your legos",
    "attachments": [
      {
        "text": "Choose your legos!",
        "fallback": "Unable to set lego stats",
        "callback_id": "lego_stats",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": "green",
            "text": "Green",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": "1"
              }, {
                "text": "2",
                "value": "2"
              }, {
                "text": "3",
                "value": "3"
              }, {
                "text": "4",
                "value": "4"
              }, {
                "text": "5",
                "value": "5"
              }, {
                "text": "6",
                "value": "6"
              }, {
                "text": "7",
                "value": "7"
              }, {
                "text": "8",
                "value": "8"
              }
            ]
          },
          {
            "name": "red",
            "text": "Red",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": "1"
              }, {
                "text": "2",
                "value": "2"
              }, {
                "text": "3",
                "value": "3"
              }, {
                "text": "4",
                "value": "4"
              }, {
                "text": "5",
                "value": "5"
              }, {
                "text": "6",
                "value": "6"
              }, {
                "text": "7",
                "value": "7"
              }, {
                "text": "8",
                "value": "8"
              }
            ]
          },
          {
            "name": "orange",
            "text": "Orange",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": "1"
              }, {
                "text": "2",
                "value": "2"
              }, {
                "text": "3",
                "value": "3"
              }, {
                "text": "4",
                "value": "4"
              }, {
                "text": "5",
                "value": "5"
              }, {
                "text": "6",
                "value": "6"
              }, {
                "text": "7",
                "value": "7"
              }, {
                "text": "8",
                "value": "8"
              }
            ]
          },
          {
            "name": "black",
            "text": "Black",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": "1"
              }, {
                "text": "2",
                "value": "2"
              }, {
                "text": "3",
                "value": "3"
              }, {
                "text": "4",
                "value": "4"
              }, {
                "text": "5",
                "value": "5"
              }, {
                "text": "6",
                "value": "6"
              }, {
                "text": "7",
                "value": "7"
              }, {
                "text": "8",
                "value": "8"
              }
            ]
          }
        ]
      }
    ]
  };
}

module.exports = controller => {
  controller.hears('lego', 'direct_mention,direct_message', (bot, message) => {
    controller.storage.teams.save({id: message.team, foo:'bar'}, function(err) { console.log(err) });
    bot.reply(message, legoMessage());
  });
};
