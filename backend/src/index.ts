import * as path from 'path';
import * as Botkit from 'botkit';
import {
  SlackConfiguration,
  SlackController,
  SlackSpawnConfiguration,
} from 'botkit';
import * as fs from 'fs';
import { Express } from 'express';
import { BotkitLegoSelectMessageRepository } from './lego/metrics/BotkitLegoSelectMessageRepository';
import { Container } from './Container';
import { LegoMetricsServiceImpl } from './lego/metrics/LegoMetricsService';
import { LegoSelectionReplyServiceImpl } from './lego/LegoSelectionReplyServiceImpl';
import { BotkitTeamChannelConfigurationRepository } from './lego/BotkitTeamChannelConfigurationRepository';
import { LegoSchedulerImpl } from './lego/LegoSchedulerImpl';
import { EventDispatcher } from './EventDispatcher';
import { LegoApplicationEventListener } from './LegoApplicationEventListener';
import { TeamChannelConfigurationServiceImpl } from './lego/TeamChannelConfigurationServiceImpl';

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.error('missing environment variables');
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
      tables: ['lego_messages', 'team_configurations'],
    });
  } else {
    botConfig.json_file_store = __dirname + '/.data/db/';
  }
  return botConfig;
}

function wireDependencies(controller) {
  const storage: any = controller.storage;

  const botkitLegoSelectMessageRepository = new BotkitLegoSelectMessageRepository(
    storage.lego_messages
  );

  Container.register(
    'legoSelectMessageRepository',
    botkitLegoSelectMessageRepository
  );
  Container.register(
    'legoMetricsService',
    new LegoMetricsServiceImpl(botkitLegoSelectMessageRepository)
  );
  Container.register(
    'legoSelectionReplyService',
    new LegoSelectionReplyServiceImpl(botkitLegoSelectMessageRepository)
  );

  const botkitTeamChannelConfigurationRepository = new BotkitTeamChannelConfigurationRepository(
    storage.team_configurations
  );

  Container.register(
    'teamChannelConfigurationRepository',
    botkitTeamChannelConfigurationRepository
  );

  Container.register(
    'legoScheduler',
    new LegoSchedulerImpl(botkitTeamChannelConfigurationRepository)
  );

  const eventDispatcher = new EventDispatcher();
  const listener = new LegoApplicationEventListener();
  eventDispatcher.register(listener);

  Container.register('eventDispatcher', eventDispatcher);

  const teamChannelConfigurationService = new TeamChannelConfigurationServiceImpl(
    botkitTeamChannelConfigurationRepository,
    eventDispatcher
  );
  Container.register(
    'teamChannelConfigurationService',
    teamChannelConfigurationService
  );
}

function startApplication() {
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

  webserver.get('/', (req, res) => {
    res.send('active');
  });

  require(`${__dirname}/components/rtm_manager_factory.js`)(controller);

  const normalizedPath = path.join(__dirname, 'skills');
  fs.readdirSync(normalizedPath).forEach(file => {
    require(`./skills/${file}`)(controller);
  });

  // @ts-ignore
  controller.trigger('rtm:start', [spawnConfig]);

  wireDependencies(controller);
}

startApplication();
