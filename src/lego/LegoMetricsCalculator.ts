import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class MetricEntry {
  categories: Array<string>;
  entries: Array<DateEntry>;
}

export class DateEntry {
  date: string;
  values?: any;

  constructor(date: string) {
    this.date = date;
    this.values = {};
  }
}

export class LegoMetricsCalculator {
  static calculate(
    messages: LegoSelectMessage[],
    config: MetricsConfiguration
  ): MetricEntry {
    let datesArray = DateUtils.toDatesArray(
      config.startDate,
      config.endDate,
      config.frequencyInDays
    );

    let categories = new Set<string>();
    let datesEntries = new Map<string, DateEntry>();

    let currentIndex: number = 0;
    for (let message of messages) {
      const dateKey: string = this.keyForMessageDate(
        datesArray,
        currentIndex,
        message.date
      );

      const selectedValues: LegoSelectedValue[] = message.selectedValues;
      let dateEntry: DateEntry =
        datesEntries.get(dateKey) || new DateEntry(dateKey);

      this.updateDateEntry(dateEntry, selectedValues, categories);

      datesEntries.set(dateKey, dateEntry);
    }

    return {
      categories: Array.from(categories),
      entries: Array.from(datesEntries.values()),
    };
  }

  private static updateDateEntry(
    dateEntry: DateEntry,
    selectedValues: LegoSelectedValue[],
    keys
  ): void {
    for (let selectedValue of selectedValues) {
      const sanitizedValueId = LegoMetricsCalculator.sanitizedEntryName(
        selectedValue
      );

      let totalSumForSelectedValueEntry: number =
        dateEntry.values[sanitizedValueId] || 0;

      const currentSumForSelectedValueEntry = LegoMetricsCalculator.sumForSelectedValueEntries(
        selectedValue.entries
      );

      const newTotal: number =
        Number(totalSumForSelectedValueEntry) +
        Number(currentSumForSelectedValueEntry);

      keys.add(sanitizedValueId);
      dateEntry.values[sanitizedValueId] = newTotal;
    }
  }

  private static keyForMessageDate(
    datesArray,
    currentIndex: number,
    messageDate
  ): string {
    let dateInPeriodForMessage: Date = LegoMetricsCalculator.dateInPeriodForMessage(
      datesArray,
      currentIndex,
      messageDate
    );
    return DateUtils.toPrettyDate(dateInPeriodForMessage.toDateString());
  }

  private static dateInPeriodForMessage(
    datesArray: Array<Date>,
    currentIndex: number,
    messageDate
  ): Date {
    let currentPeriod = datesArray[currentIndex];
    while (currentPeriod < messageDate) {
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
