import {
  AppEvent,
  AppEventTypes,
  ApplicationEventEmitter,
  TeamChannelConfigurationRepository,
  TeamChannelConfigurationService,
} from './Types';
import { TeamChannelConfiguration } from './LegoMessageFactory';
import { SlackBot } from 'botkit';

export class TeamChannelConfigurationServiceImpl
  implements TeamChannelConfigurationService {
  constructor(
    private teamChannelConfigurationRepository: TeamChannelConfigurationRepository,
    private applicationEventEmitter: ApplicationEventEmitter
  ) {}

  update(configStr: string, bot: SlackBot): Promise<TeamChannelConfiguration> {
    const configuration = TeamChannelConfigurationServiceImpl.parseConfig(
      configStr
    );

    return this.teamChannelConfigurationRepository
      .save(configuration)
      .then(configuration => {
        const updatedConfigEvent: AppEvent = {
          name: AppEventTypes.TEAM_CHANNEL_CONFIG_UPDATED,
          data: { configuration: configuration, bot: bot },
        };
        this.applicationEventEmitter.emitEvent(updatedConfigEvent);
        return configuration;
      });
  }

  static parseConfig(configStr: string): TeamChannelConfiguration {
    const configuration: TeamChannelConfiguration = JSON.parse(configStr);
    //TODO validate and throw error

    return configuration;
  }
}
