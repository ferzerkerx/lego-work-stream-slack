import { Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { DateUtils } from '../DateUtils';
import { LegoMetricsCalculator, MetricEntry } from './LegoMetricsCalculator';

export class LegoMetricsService {
  static metricsForConfig(
    storage: Storage<LegoSelectMessage>,
    config: MetricsConfiguration
  ): Promise<MetricEntry> {
    const messagesPerDatePromises: Promise<
      LegoSelectMessage[]
    >[] = this.toDatesArray(config.startDate, config.endDate).map(theDate =>
      this.findMessagesBy(storage, theDate)
    );

    return Promise.all(messagesPerDatePromises).then(
      (allMessages: LegoSelectMessage[][]) => {
        const legoSelectMessages: LegoSelectMessage[] = allMessages.reduce(
          (
            accumulator: LegoSelectMessage[],
            currentValue: LegoSelectMessage[]
          ) => accumulator.concat(currentValue)
        );
        return LegoMetricsCalculator.calculate(
          legoSelectMessages,
          this.toDatesArray(
            config.startDate,
            config.endDate,
            config.frequencyInDays
          )
        );
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

  static toDatesArray(
    startDate: Date,
    endDate?: Date,
    interval: number = 1
  ): Array<Date> {
    const theDates = [startDate];
    if (endDate) {
      if (endDate < startDate) {
        throw Error('End date should be bigger');
      }
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        currentDate = DateUtils.add(currentDate, interval);
        theDates.push(currentDate);
      }
    }
    return theDates;
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
