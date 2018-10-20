import { Storage } from 'botkit';
import { LegoSelectMessage } from '../LegoSelectMessage';
import { DateUtils } from '../../DateUtils';
import { LegoMetricsCalculator } from './LegoMetricsCalculator';
import { Metrics } from './Metrics';

export class LegoMetricsService {
  static metricsForConfig(
    storage: Storage<LegoSelectMessage>,
    config: MetricsConfiguration
  ): Promise<Metrics> {
    const messagesPerDatePromises: Promise<
      LegoSelectMessage[]
    >[] = DateUtils.toDatesArray(config.startDate, config.endDate).map(
      theDate => this.findMessagesBy(storage, theDate)
    );

    return Promise.all(messagesPerDatePromises).then(
      (allMessages: LegoSelectMessage[][]) => {
        const legoSelectMessages: LegoSelectMessage[] = allMessages.reduce(
          (
            accumulator: LegoSelectMessage[],
            currentValue: LegoSelectMessage[]
          ) => accumulator.concat(currentValue)
        );
        return LegoMetricsCalculator.calculate(legoSelectMessages, config);
      }
    );
  }

  private static findMessagesBy(
    storage: Storage<LegoSelectMessage>,
    theDate: Date
  ): Promise<LegoSelectMessage[]> {
    // @ts-ignore
    return storage.lego_messages
      .find({ date: theDate })
      .catch(e => this.defaultErrorHandling(e));
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
