import * as debug from 'debug';
import { SlackBot, SlackController, SlackSpawnConfiguration } from 'botkit';

const log = debug('botkit:rtm_manager');

function saveTeamIfNeeded(bot, controller: SlackController): void {
  let team = {
    id: bot.team_info.id,
    name: bot.team_info.name,
    bot: {
      user_id: bot.identity.id,
      name: bot.identity.name,
    },
  };
  controller.storage.teams.save(team, (err: Error) => {
    if (err) {
      console.error(err);
    }
  });
}

const createRtmManager = (controller: SlackController): any => {
  const managed_bots = {};
  // The manager object exposes some useful tools for managing the RTM
  const manager = {
    start: bot => {
      if (managed_bots[bot.config.token]) {
        log('Start RTM: already online');
      } else {
        bot.startRTM((err, bot) => {
          if (err) {
            log('Error starting RTM:', err);
          } else {
            managed_bots[bot.config.token] = bot.rtm;
            log('Start RTM: Success');
            saveTeamIfNeeded(bot, controller);
          }
        });
      }
    },
    stop: bot => {
      if (managed_bots[bot.config.token]) {
        if (managed_bots[bot.config.token].rtm) {
          log('Stop RTM: Stopping bot');
          managed_bots[bot.config.token].closeRTM();
        }
      }
    },
    remove: bot => {
      log('Removing bot from manager');
      delete managed_bots[bot.config.token];
    },
  };

  // Capture the rtm:start event and actually start the RTM...
  // @ts-ignore
  controller.on('rtm:start', (config: SlackSpawnConfiguration) => {
    const bot: SlackBot = controller.spawn(config);

    manager.start(bot);
  });

  //
  controller.on('rtm_close', bot => {
    manager.remove(bot);
  });

  return manager;
};
module.exports = createRtmManager;
