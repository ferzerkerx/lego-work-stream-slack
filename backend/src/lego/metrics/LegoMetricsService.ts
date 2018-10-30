import { LegoSelectMessage } from '../LegoSelectMessage';
import { LegoMetricsCalculator } from './LegoMetricsCalculator';
import { Metrics } from './Metrics';
import { LegoMetricsService, LegoSelectMessageRepository } from '../Types';

export class LegoMetricsServiceImpl implements LegoMetricsService {
  constructor(private repository: LegoSelectMessageRepository) {}

  metricsForConfig(config: MetricsConfiguration): Promise<Metrics> {
    return this.repository
      .findMessagesBy(config)
      .then((legoSelectMessages: LegoSelectMessage[]) => {
        return LegoMetricsCalculator.calculate(legoSelectMessages, config);
      });
  }
}
