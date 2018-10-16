import { Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class LegoMetricsService {
  static metricsForConfig(
    storage: Storage<LegoSelectMessage>,
    config: {
      startDate: Date;
      endDate?: Date;
      frequencyInDays: number;
      //TODO need to consider also the team
    }
  ): Promise<LegoSelectMessage[]> {
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
        return this.toMetricsObject(
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

  static toMetricsObject(
    messages: LegoSelectMessage[],
    datesArray: Array<Date>
  ): any {
    let keys = new Set();
    let datesEntries = {};
    let currentIndex = 0;
    for (let message of messages) {
      const selectedValues: LegoSelectedValue[] = message.selectedValues;

      let currentPeriod = this.currentPeriodForMessage(
        datesArray,
        currentIndex,
        message
      );
      const dateKey = DateUtils.toPrettyDate(currentPeriod.toDateString());
      let dateEntry = datesEntries[dateKey] || { date: dateKey };

      for (let selectedValue of selectedValues) {
        const sanitizedValueId = this.sanitizedEntryName(selectedValue);
        keys.add(sanitizedValueId);

        const userEntries = selectedValue.entries;
        const currentSumForSelectedValueEntry = this.sumForSelectedValueEntries(
          userEntries
        );

        let totalSumForSelectedValueEntry: number =
          dateEntry[sanitizedValueId] || 0;
        const newTotal: number =
          Number(totalSumForSelectedValueEntry) +
          Number(currentSumForSelectedValueEntry);
        dateEntry[sanitizedValueId] = newTotal;
      }

      datesEntries[dateKey] = dateEntry;
    }

    return {
      keys: Array.from(keys),
      entries: Object.keys(datesEntries).map(key => datesEntries[key]),
    };
  }

  private static currentPeriodForMessage(
    datesArray: Array<Date>,
    currentIndex: number,
    message
  ) {
    let currentPeriod = datesArray[currentIndex];
    while (currentPeriod < message.date) {
      currentIndex = currentIndex + 1;
      if (currentIndex >= datesArray.length) {
        throw Error('Invalid date range detected');
      }
      currentPeriod = datesArray[currentIndex];
    }
    return currentPeriod;
  }

  private static sumForSelectedValueEntries(
    userEntries: LegoSelectedValueEntry[]
  ): number {
    return userEntries
      .map(entry => entry.value)
      .reduce(
        (accumulator: number, currentValue: number) =>
          Number(accumulator) + Number(currentValue)
      );
  }

  private static sanitizedEntryName(selectedValue): string {
    return selectedValue.id.includes('lego-select-option-')
      ? selectedValue.id.substr('lego-select-option-'.length)
      : selectedValue.id;
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
