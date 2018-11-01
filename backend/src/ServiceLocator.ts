import { Container } from './Container';
import {
  LegoMetricsService,
  LegoScheduler,
  LegoSelectionReplyService,
  TeamChannelConfigurationRepository,
} from './lego/Types';
import { EventDispatcher } from './EventDispatcher';

export class ServiceLocator {
  public static getLegoScheduler(): LegoScheduler {
    return Container.resolve<LegoScheduler>('legoScheduler');
  }

  public static getEventDispatcher(): EventDispatcher {
    return Container.resolve<EventDispatcher>('eventDispatcher');
  }

  public static getLegoMetricsService(): LegoMetricsService {
    return Container.resolve<LegoMetricsService>('legoMetricsService');
  }

  public static getTeamChannelConfigurationRepository(): TeamChannelConfigurationRepository {
    return Container.resolve<TeamChannelConfigurationRepository>(
      'teamChannelConfigurationRepository'
    );
  }

  public static getLegoSelectionReplyService(): LegoSelectionReplyService {
    return Container.resolve<LegoSelectionReplyService>(
      'legoSelectionReplyService'
    );
  }
}
