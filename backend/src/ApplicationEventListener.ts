import { SlackBot, SlackController } from 'botkit';
import { ErrorUtil } from './utils/ErrorUtil';
import { Container } from './Container';
import { LegoScheduler } from './lego/Types';

export class ApplicationEventListener {
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
