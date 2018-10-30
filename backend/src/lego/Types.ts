import { LegoSelectMessage } from './LegoSelectMessage';
import { Metrics } from './metrics/Metrics';
import { SlackMessage } from 'botkit';

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
