import { TeamChannelConfiguration } from './LegoMessageFactory';
import { TeamChannelConfigurationRepository } from './Types';
import { Storage } from 'botkit';

export class BotkitTeamChannelConfigurationRepository
  implements TeamChannelConfigurationRepository {
  constructor(private storage: Storage<TeamChannelConfiguration>) {}

  public find(channelName: string): Promise<TeamChannelConfiguration> {
    return this.wrapped().find({ channelName: channelName }).then(configurations => {
      if (configurations && configurations.length > 0) {
        return configurations[0];
      }
      return null;
    });
  }

  save(
    teamConfiguration: TeamChannelConfiguration
  ): Promise<TeamChannelConfiguration> {
    return this.wrapped().save(teamConfiguration);
  }

  private wrapped(): any {
    return this.storage;
  }
}
