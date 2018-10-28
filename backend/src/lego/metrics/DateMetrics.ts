import { CategoryValueMap } from './Types';

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
