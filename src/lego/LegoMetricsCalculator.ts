import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class LegoMetricsCalculator {
  static calculate(
    messages: LegoSelectMessage[],
    datesArray: Array<Date>
  ): any {
    let keys = new Set();
    let datesEntries = {};

    let currentIndex = 0;
    for (let message of messages) {
      const selectedValues: LegoSelectedValue[] = message.selectedValues;

      let dateInPeriodForMessage = LegoMetricsCalculator.dateInPeriodForMessage(
        datesArray,
        currentIndex,
        message
      );
      const dateKey = DateUtils.toPrettyDate(
        dateInPeriodForMessage.toDateString()
      );
      let dateEntry = datesEntries[dateKey] || { date: dateKey };

      for (let selectedValue of selectedValues) {
        const sanitizedValueId = LegoMetricsCalculator.sanitizedEntryName(
          selectedValue
        );

        let totalSumForSelectedValueEntry: number =
          dateEntry[sanitizedValueId] || 0;

        const currentSumForSelectedValueEntry = LegoMetricsCalculator.sumForSelectedValueEntries(
          selectedValue.entries
        );

        const newTotal: number =
          Number(totalSumForSelectedValueEntry) +
          Number(currentSumForSelectedValueEntry);

        keys.add(sanitizedValueId);
        dateEntry[sanitizedValueId] = newTotal;
      }

      datesEntries[dateKey] = dateEntry;
    }

    return {
      keys: Array.from(keys),
      entries: Object.keys(datesEntries).map(key => datesEntries[key]),
    };
  }

  private static dateInPeriodForMessage(
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
}
