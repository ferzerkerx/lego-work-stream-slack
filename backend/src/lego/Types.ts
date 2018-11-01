import { LegoSelectMessage } from './LegoSelectMessage';
import { Metrics } from './metrics/Metrics';
import { SlackBot, SlackMessage } from 'botkit';
import { TeamChannelConfiguration } from './LegoMessageFactory';

export interface TeamChannelConfigurationRepository {
  find(channelName: string): Promise<TeamChannelConfiguration>;

  save(
    teamConfiguration: TeamChannelConfiguration
  ): Promise<TeamChannelConfiguration>;

  findAll(): Promise<TeamChannelConfiguration[]>;
}

export interface LegoSelectMessageRepository {
  findMessagesBy(config: MetricsConfiguration): Promise<LegoSelectMessage[]>;

  find(messageId: string): Promise<LegoSelectMessage>;

  save(legoMessage: LegoSelectMessage): Promise<LegoSelectMessage>;
}

export interface LegoMetricsService {
  metricsForConfig(config: MetricsConfiguration): Promise<Metrics>;
}

export interface LegoSelectionReplyService {
  createReply(message): Promise<SlackMessage | void>;
}

export interface LegoScheduler {
  start(bot: SlackBot);
}

export class AppEvent {
  name: string;
  data: any;
}

export class AppEventTypes {
  static STARTED: string = 'STARTED';
  static TEAM_CHANNEL_CONFIG_UPDATED: string = 'TEAM_CHANNEL_CONFIG_UPDATED';
}

export interface ApplicationEventListener {
  onEvent(event: AppEvent): void;
}

export interface ApplicationEventEmitter {
  emitEvent(event: AppEvent): void;
}
