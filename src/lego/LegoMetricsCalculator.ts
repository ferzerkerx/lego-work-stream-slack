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

  merge(valuesByCategoryToAdd: any): DateEntry {
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
    const datePeriods: Date[] = DateUtils.toDatesArray(
      config.startDate,
      config.endDate,
      config.frequencyInDays
    );

    const categories = new Set<string>();
    const dateEntries = new Map<string, DateEntry>();

    for (let message of messages) {
      const valuesByCategoryForMessage = this.valuesByCategoryForMessage(
        message
      );

      const datePeriodForMessage: string = this.datePeriodForMessage(
        datePeriods,
        message.date
      );

      const dateEntry: DateEntry =
        dateEntries.get(datePeriodForMessage) ||
        new DateEntry(datePeriodForMessage);
      const mergedDateEntry = dateEntry.merge(valuesByCategoryForMessage);

      Object.keys(valuesByCategoryForMessage).forEach(category =>
        categories.add(category)
      );

      dateEntries.set(datePeriodForMessage, mergedDateEntry);
    }

    return {
      categories: Array.from(categories),
      entries: Array.from(dateEntries.values()),
    };
  }

  private static valuesByCategoryForMessage(message): any {
    const selectedValues: LegoSelectedValue[] = message.selectedValues;
    return this.valuesByCategory(selectedValues);
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

  private static datePeriodForMessage(datesArray, messageDate): string {
    let dateInPeriodForMessage: Date = LegoMetricsCalculator.dateInPeriodForMessage(
      datesArray,
      messageDate
    );
    return DateUtils.toPrettyDate(dateInPeriodForMessage.toDateString());
  }

  private static dateInPeriodForMessage(
    datesArray: Array<Date>,
    messageDate
  ): Date {
    let currentIndex: number = 0;
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
    selectedValueEntries: LegoSelectedValueEntry[]
  ): number {
    return selectedValueEntries
      .map(selectedValueEntry => selectedValueEntry.value)
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
