import {SlackConfiguration, SlackSpawnConfiguration} from "botkit";

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  process.exit(1);
}

const Botkit = require('botkit');

function slackBotConfiguration() : SlackConfiguration{
  const botConfig: SlackConfiguration = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    debug: true,
    scopes: ['bot']
  };

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
  if (process.env.MONGO_URI) {
    botConfig.storage = require('botkit-storage-mongo')({
      mongoUri: process.env.MONGO_URI,
    });
  } else {
    botConfig.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
  }
  return botConfig;

}

const spawnConfig: SlackSpawnConfiguration = {
  token: process.env.API_TOKEN,
};

const botConfig:SlackConfiguration = slackBotConfiguration();

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(botConfig);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(
  controller
);

controller.createWebhookEndpoints(webserver);

controller.startTicking();

if (!process.env.clientId || !process.env.clientSecret) {
  webserver.get('/', (req, res) =>{
    res.send('active');
  });
  console.log(
    'WARNING: This application is not fully configured to work with Slack'
  );
} else {
  webserver.get('/', (req, res)=> {
    res.send('active');
  });

  // Set up a simple storage backend for keeping a record of customers
  // who sign up for the app via the oauth
  require(__dirname + '/components/rtm_manager.js')(controller);

  const normalizedPath = require('path').join(__dirname, 'skills');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(function(file) {
      require('./skills/' + file)(controller);
    });

  controller.trigger('rtm:start', [spawnConfig]);
}