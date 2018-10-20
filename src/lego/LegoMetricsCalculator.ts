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
  valuesByCategory?: any;

  constructor(date: string) {
    this.date = date;
    this.valuesByCategory = {};
  }

  add(valuesByCategoryToAdd: any): DateEntry {
    let result = new DateEntry(this.date);

    let valuesByCategory: any = { ...this.valuesByCategory };
    Object.keys(valuesByCategoryToAdd).forEach(category => {
      let currentValue = valuesByCategory[category] || 0;
      currentValue = currentValue + valuesByCategoryToAdd[category];
      valuesByCategory[category] = currentValue;
    });

    result.valuesByCategory = { ...valuesByCategory };
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

      const valuesByCategory = this.valuesByCategory(selectedValues);
      const mergedDateEntry = dateEntry.add(valuesByCategory);

      Object.keys(valuesByCategory).forEach(category =>
        categories.add(category)
      );

      datesEntries.set(dateKey, mergedDateEntry);
    }

    return {
      categories: Array.from(categories),
      entries: Array.from(datesEntries.values()),
    };
  }

  private static valuesByCategory(selectedValues: LegoSelectedValue[]): any {
    let result: any = {};
    for (let selectedValue of selectedValues) {
      const categoryName = LegoMetricsCalculator.extractCategoryName(
        selectedValue
      );

      let totalSumForCategory: number = result[categoryName] || 0;

      const currentSumForCategory = LegoMetricsCalculator.extractSumForCategory(
        selectedValue.entries
      );

      result[categoryName] =
        Number(totalSumForCategory) + Number(currentSumForCategory);
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

  private static extractSumForCategory(
    userEntries: LegoSelectedValueEntry[]
  ): number {
    return userEntries
      .map(
        (selectedValueEntry: LegoSelectedValueEntry) => selectedValueEntry.value
      )
      .reduce(
        (accumulator: number, currentValue: number) =>
          Number(accumulator) + Number(currentValue)
      );
  }

  private static extractCategoryName(selectedValue): string {
    return selectedValue.id.includes('lego-select-option-')
      ? selectedValue.id.substr('lego-select-option-'.length)
      : selectedValue.id;
  }
}
