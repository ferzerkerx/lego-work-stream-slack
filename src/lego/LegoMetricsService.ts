import { Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';

export class LegoMetricsService {
  static metricsForDate(
    storage: Storage<LegoSelectMessage>,
    config:{
      startDate: Date,
      endDate?: Date
    }): Promise<LegoSelectMessage[]> {
    //TODO need to consider also the team

    const messagesPerDatePromises: Promise<
      LegoSelectMessage[]
    >[] = this.datesArray(config.startDate, config.endDate).map(theDate =>
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
        return this.toMetricsObject(legoSelectMessages);
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

  static datesArray(startDate: Date, endDate?: Date): Array<Date> {
    const theDates = [startDate];
    if (endDate) {
      if (endDate < startDate) {
        throw Error('End date should be bigger');
      }
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        currentDate = DateUtils.add(currentDate, 1);
        theDates.push(currentDate);
      }
    }
    return theDates;
  }

  static toMetricsObject(messages: LegoSelectMessage[]): any {
    let keys = new Set();
    let datesEntries = {};
    for (let message of messages) {
      const selectedValues: LegoSelectedValue[] = message.selectedValues;

      const dateKey = DateUtils.toPrettyDate(message.date.toDateString());
      let dateEntry = datesEntries[dateKey] || { date: dateKey };

      for (let selectedValue of selectedValues) {
        const userEntries = selectedValue.entries;

        const sanitizedValueId = selectedValue.id.includes(
          'lego-select-option-'
        )
          ? selectedValue.id.substr('lego-select-option-'.length)
          : selectedValue.id;
        keys.add(sanitizedValueId);
        const currentSum: number = userEntries
          .map(entry => entry.value)
          .reduce(
            (accumulator: number, currentValue: number) =>
              Number(accumulator) + Number(currentValue)
          );

        let totalSum: number = dateEntry[sanitizedValueId] || 0;
        dateEntry[sanitizedValueId] = Number(totalSum) + Number(currentSum);
      }

      datesEntries[dateKey] = dateEntry;
    }

    return {
      keys: Array.from(keys),
      entries: Object.keys(datesEntries).map(key => datesEntries[key]),
    };
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
