import { Storage } from 'botkit';
import { LegoSelectMessage } from '../LegoSelectMessage';
import { LegoMetricsCalculator } from './LegoMetricsCalculator';
import { Metrics } from './Metrics';

export class LegoMetricsService {
  static metricsForConfig(
    storage: Storage<LegoSelectMessage>,
    config: MetricsConfiguration
  ): Promise<Metrics> {
    return this.findMessagesBy(storage, config).then(
      (legoSelectMessages: LegoSelectMessage[]) => {
        return LegoMetricsCalculator.calculate(legoSelectMessages, config);
      }
    );
  }

  private static findMessagesBy(
    storage: Storage<LegoSelectMessage>,
    config: MetricsConfiguration
  ): Promise<LegoSelectMessage[]> {
    const conditions: any = [
      { date: { $gte: config.startDate } },
      { date: { $lte: config.endDate } },
    ];

    if (config.teams && config.teams.length > 0) {
      conditions.push({ 'channelData.name': { $in: config.teams } });
    }
    const query = {
      $and: conditions,
    };

    // @ts-ignore
    return storage.lego_messages
      .find(query)
      .catch(e => this.defaultErrorHandling(e));
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
