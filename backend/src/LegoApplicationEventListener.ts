import { SlackBot, SlackController } from 'botkit';
import { ErrorUtil } from './utils/ErrorUtil';
import {
  AppEvent,
  AppEventTypes,
  ApplicationEventListener,
} from './lego/Types';
import { ServiceLocator } from './ServiceLocator';

export class LegoApplicationEventListener implements ApplicationEventListener {
  onEvent(event: AppEvent): void {
    if (event.name === AppEventTypes.STARTED) {
      LegoApplicationEventListener.onCommunicationChannelEstablished(
        event.data.bot,
        event.data.controller
      );
    }
    if (event.name === AppEventTypes.TEAM_CHANNEL_CONFIG_UPDATED) {
      ServiceLocator.getLegoScheduler().schedule(
        event.data.configuration,
        event.data.bot
      );
    }
  }

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
    ServiceLocator.getLegoScheduler().start(bot);
  }
}
