import { DateMetrics } from './DateMetrics';
import { DateUtils } from '../../utils/DateUtils';

interface CsvDataProvider {
  csvData(): string[][];
}

export class Metrics implements CsvDataProvider {
  categories: string[];
  entries: Array<DateMetrics>;

  constructor(categories: string[], entries: Array<DateMetrics>) {
    this.categories = categories;
    this.entries = entries;
  }

  csvData(): string[][] {
    const data: string[][] = [];

    data.push(['date', ...this.categories]);

    this.entries.forEach((entry: DateMetrics) => {
      let values: string[] = [DateUtils.toPrettyDate(entry.date)];
      for (let category of this.categories) {
        const value = entry.valuesByCategory[category] || 0;
        values.push(`${value}`);
      }
      data.push(values);
    });
    return data;
  }
}
