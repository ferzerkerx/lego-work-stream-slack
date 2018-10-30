import * as debug from 'debug';
import { SlackBot, SlackController, SlackSpawnConfiguration } from 'botkit';
import { ErrorUtil } from '../utils/ErrorUtil';
import { Container } from '../Container';
import { LegoScheduler } from '../lego/Types';

const log = debug('botkit:rtm_manager');

class Manager {
  private managed_bots: any = {};

  start(bot): Promise<any> {
    if (this.managed_bots[bot.config.token]) {
      log('Start RTM: already online');
      return bot.config.token;
    }
    return new Promise<any>((resolve, reject) => {
      bot.startRTM((err, bot) => {
        if (err) {
          log('Error starting RTM:', err);
          reject(err);
        } else {
          this.managed_bots[bot.config.token] = bot.rtm;
          log('Start RTM: Success');
          resolve(bot.config.token);
        }
      });
    });
  }

  stop(bot): void {
    if (this.managed_bots[bot.config.token]) {
      if (this.managed_bots[bot.config.token].rtm) {
        log('Stop RTM: Stopping bot');
        this.managed_bots[bot.config.token].closeRTM();
      }
    }
  }

  remove(bot): void {
    log('Removing bot from manager');
    delete this.managed_bots[bot.config.token];
  }
}

class ApplicationEventListener {
  static _saveTeamIfNeeded(
    bot: SlackBot,
    controller: SlackController
  ): Promise<void> {
    // @ts-ignore
    const team_info = bot.team_info;
    const identity = bot.identity;
    // @ts-ignore
    const user_id = identity.id;
    let team = {
      id: team_info.id,
      name: team_info.name,
      bot: {
        user_id: user_id,
        name: identity.name,
      },
    };
    return new Promise<void>((resolve, reject) => {
      controller.storage.teams.save(team, (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static onCommunicationChannelEstablished(bot: SlackBot, controller): void {
    this._saveTeamIfNeeded(bot, controller).catch(error =>
      ErrorUtil.defaultErrorHandling(error)
    );
    this.getLegoScheduler().start(bot);
  }

  private static getLegoScheduler() {
    return Container.resolve<LegoScheduler>('legoScheduler');
  }
}

const createRtmManager = (controller: SlackController): any => {
  const manager = new Manager();

  // @ts-ignore
  controller.on('rtm:start', (config: SlackSpawnConfiguration) => {
    const bot: SlackBot = controller.spawn(config);

    manager.start(bot).then(() => {
      ApplicationEventListener.onCommunicationChannelEstablished(
        bot,
        controller
      );
    });
  });

  //
  controller.on('rtm_close', bot => {
    manager.remove(bot);
  });

  return manager;
};
module.exports = createRtmManager;
