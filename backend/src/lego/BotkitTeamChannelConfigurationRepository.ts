import { TeamChannelConfiguration } from './LegoMessageFactory';
import { TeamChannelConfigurationRepository } from './Types';
import { Storage } from 'botkit';

export class BotkitTeamChannelConfigurationRepository
  implements TeamChannelConfigurationRepository {
  constructor(private storage: Storage<TeamChannelConfiguration>) {}

  public find(channelName: string): Promise<TeamChannelConfiguration> {
    const result = this.wrapped().find({ channelName: channelName });

    if (result && result.length > 0) {
      return result[0];
    }

    return null;
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
