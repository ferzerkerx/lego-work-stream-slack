import {
  AppEvent,
  AppEventTypes,
  ApplicationEventEmitter,
  TeamChannelConfigurationRepository,
  TeamChannelConfigurationService,
} from './Types';
import { TeamChannelConfiguration } from './LegoMessageFactory';
import { SlackBot } from 'botkit';
import { ErrorUtil } from '../utils/ErrorUtil';

export class TeamChannelConfigurationServiceImpl
  implements TeamChannelConfigurationService {
  constructor(
    private teamChannelConfigurationRepository: TeamChannelConfigurationRepository,
    private applicationEventEmitter: ApplicationEventEmitter
  ) {}

  update(
    configStr: string,
    bot: SlackBot,
    channelId: string
  ): Promise<TeamChannelConfiguration> {
    const configuration = TeamChannelConfigurationServiceImpl.parseConfig(
      configStr
    );

    if (!configuration) {
      return Promise.reject('Invalid configuration');
    }

    configuration.id = channelId;
    configuration.channelName = channelId;

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
    try {
      const configuration: TeamChannelConfiguration = JSON.parse(configStr);
      if (this.isValid(configuration)) {
        return configuration;
      }
    } catch (e) {
      ErrorUtil.defaultErrorHandling(e);
    }
    return null;
  }

  static isEmpty(str: string | Array<any>) {
    return !str || str.length === 0;
  }

  static isValid(configuration: TeamChannelConfiguration): boolean {
    if (this.isEmpty(configuration.actionDescriptors)) {
      return false;
    }

    for (let descriptor of configuration.actionDescriptors) {
      if (this.isEmpty(descriptor.name) || this.isEmpty(descriptor.text)) {
        return false;
      }
    }

    if (!isFinite(configuration.max) || configuration.max < 0) {
      return false;
    }

    if (!isFinite(configuration.min) || configuration.min < 0) {
      return false;
    }

    if (configuration.max < configuration.min) {
      return false;
    }

    return true;
  }
}
