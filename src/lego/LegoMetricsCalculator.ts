import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../DateUtils';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class Metrics {
  categories: Array<string>;
  entries: Array<DateMetrics>;
}

export class DateMetrics {
  date: string;
  valuesByCategory?: CategoryValueMap;

  constructor(date: string) {
    this.date = date;
    this.valuesByCategory = {};
  }

  merge(valuesByCategoryToAdd: CategoryValueMap): DateMetrics {
    let result = new DateMetrics(this.date);

    let valuesByCategory: CategoryValueMap = { ...this.valuesByCategory };
    Object.keys(valuesByCategoryToAdd).forEach(category => {
      let currentValue = valuesByCategory[category] || 0;
      currentValue = currentValue + valuesByCategoryToAdd[category];
      valuesByCategory[category] = currentValue;
    });

    result.valuesByCategory = { ...valuesByCategory };
    return result;
  }
}

interface CategoryValueMap {
  [category: string]: number;
}

export class LegoMetricsCalculator {
  static calculate(
    messages: LegoSelectMessage[],
    config: MetricsConfiguration
  ): Metrics {
    const datePeriods: Date[] = DateUtils.toDatesArray(
      config.startDate,
      config.endDate,
      config.frequencyInDays
    );

    const categories = new Set<string>();
    const dateEntries = new Map<string, DateMetrics>();

    for (let message of messages) {
      const metricsForMessage = this.metricsForMessage(message, datePeriods);

      const dateMetrics: DateMetrics =
        dateEntries.get(metricsForMessage.datePeriodForMessage) ||
        new DateMetrics(metricsForMessage.datePeriodForMessage);
      const mergedDateMetrics = dateMetrics.merge(
        metricsForMessage.valuesByCategoryForMessage
      );

      Object.keys(metricsForMessage.valuesByCategoryForMessage).forEach(
        category => categories.add(category)
      );

      dateEntries.set(
        metricsForMessage.datePeriodForMessage,
        mergedDateMetrics
      );
    }

    return {
      categories: Array.from(categories),
      entries: Array.from(dateEntries.values()),
    };
  }

  private static metricsForMessage(
    message,
    datePeriods: Date[]
  ): {
    datePeriodForMessage: string;
    valuesByCategoryForMessage: CategoryValueMap;
  } {
    const selectedValues: LegoSelectedValue[] = message.selectedValues;
    const valuesByCategoryForMessage = this.valuesByCategory(selectedValues);

    const datePeriodForMessage: string = this.datePeriodForMessage(
      datePeriods,
      message.date
    );

    return {
      datePeriodForMessage,
      valuesByCategoryForMessage,
    };
  }

  private static valuesByCategory(
    selectedValues: LegoSelectedValue[]
  ): CategoryValueMap {
    let categoryValueMap: CategoryValueMap = {};
    for (let selectedValue of selectedValues) {
      const categoryName = LegoMetricsCalculator.extractCategoryName(
        selectedValue
      );

      let totalSumForCategory: number = categoryValueMap[categoryName] || 0;

      const currentSumForCategory = LegoMetricsCalculator.extractSumForCategory(
        selectedValue.entries
      );

      categoryValueMap[categoryName] =
        Number(totalSumForCategory) + Number(currentSumForCategory);
    }
    return categoryValueMap;
  }

  private static datePeriodForMessage(datesArray, messageDate): string {
    let dateInPeriodForMessage: Date = LegoMetricsCalculator.dateInPeriodForMessage(
      datesArray,
      messageDate
    );
    return DateUtils.toPrettyDate(dateInPeriodForMessage.toDateString());
  }

  private static dateInPeriodForMessage(
    datePeriods: Array<Date>,
    messageDate
  ): Date {
    let currentIndex: number = 0;
    let currentPeriod = datePeriods[currentIndex];
    while (currentPeriod < messageDate) {
      currentIndex = currentIndex + 1;
      if (currentIndex >= datePeriods.length) {
        throw Error('Invalid date range detected');
      }
      currentPeriod = datePeriods[currentIndex];
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
