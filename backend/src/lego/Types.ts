import { LegoSelectMessage } from './LegoSelectMessage';
import { Metrics } from './metrics/Metrics';

export interface LegoSelectMessageRepository {
  findMessagesBy(config: MetricsConfiguration): Promise<LegoSelectMessage[]>;
}

export interface LegoMetricsService {
  metricsForConfig(config: MetricsConfiguration): Promise<Metrics>;
}
