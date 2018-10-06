import * as path from 'path';
import {
  SlackConfiguration,
  SlackController,
  SlackSpawnConfiguration,
} from 'botkit';
import * as fs from 'fs';
import * as Botkit from 'botkit';
import { Express } from 'express';

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  process.exit(1);
}

function slackBotConfiguration(): SlackConfiguration {
  const botConfig: SlackConfiguration = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    debug: true,
    rtm_receive_messages: true,
    scopes: ['bot', 'incoming-webhook'],
  };

  if (process.env.MONGODB_URI) {
    console.log('Using MongoDB as storage');
    botConfig.storage = require('botkit-storage-mongo')({
      mongoUri: process.env.MONGODB_URI,
      tables: ['lego_messages'],
    });
  } else {
    botConfig.json_file_store = __dirname + '/.data/db/';
  }
  return botConfig;
}

const spawnConfig: SlackSpawnConfiguration = {
  token: process.env.API_TOKEN,
};

const botConfig: SlackConfiguration = slackBotConfiguration();

const controller: SlackController = Botkit.slackbot(botConfig);

const webserver: Express = require(`${__dirname}/components/express_webserver.js`)(
  controller
);

controller.startTicking();

controller.createWebhookEndpoints(webserver);

if (!process.env.clientId || !process.env.clientSecret) {
  webserver.get('/', (req, res) => {
    res.send('active');
  });
  console.log(
    'WARNING: This application is not fully configured to work with Slack'
  );
} else {
  webserver.get('/', (req, res) => {
    res.send('active');
  });

  require(`${__dirname}/components/rtm_manager.js`)(controller);

  const normalizedPath = path.join(__dirname, 'skills');
  fs.readdirSync(normalizedPath).forEach(file => {
    require(`./skills/${file}`)(controller);
  });

  // @ts-ignore
  controller.trigger('rtm:start', [spawnConfig]);
}
