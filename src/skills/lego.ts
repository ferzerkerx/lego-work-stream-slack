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
            "name": "lego-select-option-green",
            "text": "Green",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": 1
              }, {
                "text": "2",
                "value": 2
              }, {
                "text": "3",
                "value": 3
              }, {
                "text": "4",
                "value": 4
              }, {
                "text": "5",
                "value": 5
              }, {
                "text": "6",
                "value": 6
              }, {
                "text": "7",
                "value": 7
              }, {
                "text": "8",
                "value": 8
              }
            ]
          },
          {
            "name": "lego-select-option-red",
            "text": "Red",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": 1
              }, {
                "text": "2",
                "value": 2
              }, {
                "text": "3",
                "value": 3
              }, {
                "text": "4",
                "value": 4
              }, {
                "text": "5",
                "value": 5
              }, {
                "text": "6",
                "value": 6
              }, {
                "text": "7",
                "value": 7
              }, {
                "text": "8",
                "value": 8
              }
            ]
          },
          {
            "name": "lego-select-option-orange",
            "text": "Orange",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": 1
              }, {
                "text": "2",
                "value": 2
              }, {
                "text": "3",
                "value": 3
              }, {
                "text": "4",
                "value": 4
              }, {
                "text": "5",
                "value": 5
              }, {
                "text": "6",
                "value": 6
              }, {
                "text": "7",
                "value": 7
              }, {
                "text": "8",
                "value": 8
              }
            ]
          },
          {
            "name": "lego-select-option-black",
            "text": "Black",
            "type": "select",
            "options": [
              {
                "text": "1",
                "value": 1
              }, {
                "text": "2",
                "value": 2
              }, {
                "text": "3",
                "value": 3
              }, {
                "text": "4",
                "value": 4
              }, {
                "text": "5",
                "value": 5
              }, {
                "text": "6",
                "value": 6
              }, {
                "text": "7",
                "value": 7
              }, {
                "text": "8",
                "value": 8
              }
            ]
          }
        ]
      }
    ]
  };
}
//TODO this function needs to be called when the bot starts
function saveTeamIfNeeded(bot, controller) {
  let team = {
    id: bot.team_info.id,
    name: bot.team_info.name,
    bot: {
      user_id: bot.identity.id,
      name: bot.identity.name
    }
  };
  controller.storage.teams.save(team, function (err) {
    if (err)
      console.log(err)
  });
}

module.exports = controller => {
  controller.hears('lego', 'direct_mention,direct_message', (bot, message) => {

    saveTeamIfNeeded(bot, controller);
    bot.reply(message, legoMessage());
  });
};