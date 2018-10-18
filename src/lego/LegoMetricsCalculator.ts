import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export interface MetricEntry {
  keys: Array<string>;
  entries: Array<DateEntry>;
}

export interface DateEntry {
  date: Date;
  metricValues: Map<string, number>;
}

export class LegoMetricsCalculator {
  static calculate(
    messages: LegoSelectMessage[],
    datesArray: Array<Date>
  ): MetricEntry {
    let keys = new Set<string>();
    let datesEntries = new Map<string, any>();

    let currentIndex = 0;
    for (let message of messages) {
      const selectedValues: LegoSelectedValue[] = message.selectedValues;

      let dateInPeriodForMessage: Date = LegoMetricsCalculator.dateInPeriodForMessage(
        datesArray,
        currentIndex,
        message
      );
      const dateKey: string = DateUtils.toPrettyDate(
        dateInPeriodForMessage.toDateString()
      );
      let dateEntry: DateEntry = datesEntries[dateKey] || { date: dateKey };

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

    const entries: Array<DateEntry> = Object.keys(datesEntries).map(
      key => datesEntries[key]
    );
    return {
      keys: Array.from(keys),
      entries: entries,
    };
  }

  private static dateInPeriodForMessage(
    datesArray: Array<Date>,
    currentIndex: number,
    message
  ): Date {
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
      .map((entry: LegoSelectedValueEntry) => entry.value)
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
