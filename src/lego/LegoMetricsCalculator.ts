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

  add(valuesToAdd:any) : DateEntry  {

    let result = new DateEntry(this.date);

    let values:any = {...this.values};
    Object.keys(valuesToAdd)
      .forEach(value=> {

        let currentValue = values[value] || 0;
          currentValue = currentValue + valuesToAdd[value];
          values[value] = currentValue;
      });

    result.values = {...values};
    return result;
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

      const valuesForEntry = this.valuesForEntry(selectedValues);
      const mergedDateEntry = dateEntry.add(valuesForEntry);

      Object.keys(valuesForEntry)
        .forEach(value=> categories.add(value));

      datesEntries.set(dateKey, mergedDateEntry);
    }

    return {
      categories: Array.from(categories),
      entries: Array.from(datesEntries.values()),
    };
  }

  private static valuesForEntry(
    selectedValues: LegoSelectedValue[]
  ): any {

    let result: any = {};
    for (let selectedValue of selectedValues) {
      const sanitizedValueId = LegoMetricsCalculator.sanitizedEntryName(
        selectedValue
      );

      let totalSumForSelectedValueEntry: number =
        result[sanitizedValueId] || 0;

      const currentSumForSelectedValueEntry = LegoMetricsCalculator.sumForSelectedValueEntries(
        selectedValue.entries
      );

      result[sanitizedValueId] = Number(totalSumForSelectedValueEntry) +
        Number(currentSumForSelectedValueEntry);
    }
    return result;
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
