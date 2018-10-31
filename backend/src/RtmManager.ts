import * as debug from 'debug';

const log = debug('RtmManager');

export class RtmManager {
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
