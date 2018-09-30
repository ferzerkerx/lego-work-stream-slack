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
    console.log(JSON.stringify(message))
    controller.storage.teams.save({id: message.team, foo:"bar"}, function(err){
      if (err)
        console.log(err)
    });
    bot.reply(message, legoMessage());
  });
};



/*

{"payload":"{\"type\":\"interactive_message\",\"actions\":[{\"name\":\"green\",\"type\":\"select\",\"selected_options\":[{\"value\":\"7\"}]}],\"callback_id\":\"lego_stats\",\"team\":{\"id\":\"T7HSGMZ1P\",\"domain\":\"patitasoftware\"},\"channel\":{\"id\":\"CCYMFJ8E5\",\"name\":\"testingchannel\"},\"user\":{\"id\":\"U7JA2JRMH\",\"name\":\"ferzerkerx\"},\"action_ts\":\"1538338468.886739\",\"message_ts\":\"1538338466.000200\",\"attachment_id\":\"1\",\"token\":\"VFpuTz4h3v1AWGuxqekDBHhC\",\"is_app_unfurl\":false,\"original_message\":{\"type\":\"message\",\"user\":\"UCZEHCY7P\",\"text\":\"Please Select your legos\",\"bot_id\":\"BD0AU2U3H\",\"attachments\":[{\"callback_id\":\"lego_stats\",\"fallback\":\"Unable to set lego stats\",\"text\":\"Choose your legos!\",\"id\":1,\"color\":\"3AA3E3\",\"actions\":[{\"id\":\"1\",\"name\":\"green\",\"text\":\"Green\",\"type\":\"select\",\"data_source\":\"static\",\"options\":[{\"text\":\"1\",\"value\":\"1\"},{\"text\":\"2\",\"value\":\"2\"},{\"text\":\"3\",\"value\":\"3\"},{\"text\":\"4\",\"value\":\"4\"},{\"text\":\"5\",\"value\":\"5\"},{\"text\":\"6\",\"value\":\"6\"},{\"text\":\"7\",\"value\":\"7\"},{\"text\":\"8\",\"value\":\"8\"}]},{\"id\":\"2\",\"name\":\"red\",\"text\":\"Red\",\"type\":\"select\",\"data_source\":\"static\",\"options\":[{\"text\":\"1\",\"value\":\"1\"},{\"text\":\"2\",\"value\":\"2\"},{\"text\":\"3\",\"value\":\"3\"},{\"text\":\"4\",\"value\":\"4\"},{\"text\":\"5\",\"value\":\"5\"},{\"text\":\"6\",\"value\":\"6\"},{\"text\":\"7\",\"value\":\"7\"},{\"text\":\"8\",\"value\":\"8\"}]},{\"id\":\"3\",\"name\":\"orange\",\"text\":\"Orange\",\"type\":\"select\",\"data_source\":\"static\",\"options\":[{\"text\":\"1\",\"value\":\"1\"},{\"text\":\"2\",\"value\":\"2\"},{\"text\":\"3\",\"value\":\"3\"},{\"text\":\"4\",\"value\":\"4\"},{\"text\":\"5\",\"value\":\"5\"},{\"text\":\"6\",\"value\":\"6\"},{\"text\":\"7\",\"value\":\"7\"},{\"text\":\"8\",\"value\":\"8\"}]},{\"id\":\"4\",\"name\":\"black\",\"text\":\"Black\",\"type\":\"select\",\"data_source\":\"static\",\"options\":[{\"text\":\"1\",\"value\":\"1\"},{\"text\":\"2\",\"value\":\"2\"},{\"text\":\"3\",\"value\":\"3\"},{\"text\":\"4\",\"value\":\"4\"},{\"text\":\"5\",\"value\":\"5\"},{\"text\":\"6\",\"value\":\"6\"},{\"text\":\"7\",\"value\":\"7\"},{\"text\":\"8\",\"value\":\"8\"}]}]}],\"ts\":\"1538338466.000200\"},\"response_url\":\"https:\\/\\/hooks.slack.com\\/actions\\/T7HSGMZ1P\\/447189006359\\/pjgmZqAmD39K6nuLA2ctnJs3\",\"trigger_id\":\"446318550805.255900747057.6fbd70034fa882be7d3eba1c90026f65\"}"}
 */