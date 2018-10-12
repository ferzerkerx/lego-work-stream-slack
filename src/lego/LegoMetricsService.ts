import { Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { Utils } from '../Utils';

export class LegoMetricsService {
  static metricsForDate(
    date: Date,
    storage: Storage<LegoSelectMessage>
  ): Promise<LegoSelectMessage[]> {
    //TODO need to consider also the team
    // @ts-ignore
    return storage.lego_messages
      .find({ date: date })
      .then(messages => this.toMetricsObject(messages))
      .catch(e => this.defaultErrorHandling(e));
  }

  static toMetricsObject(messages: LegoSelectMessage[]): any {
    let keys = new Set();
    let datesEntries = {};
    for (let message of messages) {
      const selectedValues: LegoSelectedValue[] = message.selectedValues;

      const dateKey = Utils.toPrettyDate(message.date.toDateString());
      let dateEntry = datesEntries[dateKey] || { date: dateKey };

      for (let selectedValue of selectedValues) {
        const userEntries = selectedValue.entries;

        keys.add(selectedValue.id);
        const currentSum = userEntries
          .map(entry => entry.value)
          .reduce((accumulator, currentValue) => accumulator + currentValue);

        let totalSum : number = dateEntry[selectedValue.id] || 0;
        dateEntry[selectedValue.id] = totalSum + currentSum;
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
