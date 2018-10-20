import { LegoSelectMessage } from '../LegoSelectMessage';
import { LegoSelectedValue } from '../LegoSelectedValue';
import { DateUtils } from '../../DateUtils';
import { LegoSelectedValueEntry } from '../LegoSelectedValueEntry';
import { DateMetrics } from './DateMetrics';
import { Metrics } from './Metrics';
import { CategoryValueMap } from './Types';

interface RawMetrics {
  categories: Set<string>;
  dateEntries: Map<string, DateMetrics>;
}

interface MessageMetrics {
  datePeriodForMessage: string;
  valuesByCategoryForMessage: CategoryValueMap;
}

export class LegoMetricsCalculator {
  static calculate(
    messages: LegoSelectMessage[],
    config: MetricsConfiguration
  ): Metrics {
    const rawMetrics: RawMetrics = this.rawMetrics(config, messages);

    let dateMetrics = rawMetrics.dateEntries;
    if (config.isPercentage) {
      dateMetrics = this.toPercentage(dateMetrics);
    }
    return {
      categories: Array.from(rawMetrics.categories),
      entries: Array.from(dateMetrics.values()),
    };
  }

  private static toPercentage(
    dateMetrics: Map<string, DateMetrics>
  ): Map<string, DateMetrics> {
    for (let dateEntry of dateMetrics.values()) {
      const categoryValueMapForDateEntry: CategoryValueMap =
        dateEntry.valuesByCategory;

      const totalValueForDateEntry = this.totalValueForDateEntry(
        categoryValueMapForDateEntry
      );

      if (totalValueForDateEntry > 0) {
        for (let category of Object.keys(categoryValueMapForDateEntry)) {
          const percentageValue =
            (categoryValueMapForDateEntry[category] / totalValueForDateEntry) *
            100;
          categoryValueMapForDateEntry[category] = Math.round(percentageValue);
        }
      }
    }
    return dateMetrics;
  }

  private static totalValueForDateEntry(
    categoryValueMapForDateEntry: CategoryValueMap
  ): number {
    return Object.keys(categoryValueMapForDateEntry)
      .map(category => categoryValueMapForDateEntry[category])
      .reduce(
        (accumulator: number, currentValue: number) =>
          Number(accumulator) + Number(currentValue)
      );
  }

  private static rawMetrics(
    config: MetricsConfiguration,
    messages: LegoSelectMessage[]
  ): RawMetrics {
    const datePeriods: Date[] = DateUtils.toDatesArray(
      config.startDate,
      config.endDate,
      config.frequencyInDays
    );

    const categories = new Set<string>();
    const dateEntries = new Map<string, DateMetrics>();

    for (let message of messages) {
      const metricsForMessage: MessageMetrics = this.metricsForMessage(
        message,
        datePeriods
      );

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
      categories: categories,
      dateEntries: dateEntries,
    };
  }

  private static metricsForMessage(
    message,
    datePeriods: Date[]
  ): MessageMetrics {
    const selectedValues: LegoSelectedValue[] = message.selectedValues;
    const valuesByCategoryForMessage = this.valuesByCategory(selectedValues);

    const datePeriodForMessage: string = this.datePeriodForMessage(
      datePeriods,
      message.date
    );

    return {
      datePeriodForMessage: datePeriodForMessage,
      valuesByCategoryForMessage: valuesByCategoryForMessage,
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
