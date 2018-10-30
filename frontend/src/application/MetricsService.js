import { Utils } from './Utils';

class MetricsService {
  static createConfiguration(form) {
    const startDate = form.startDate.value || Utils.toDateString(new Date());
    const endDate =
      form.endDate.value || Utils.toDateString(Utils.addDays(startDate, 1));
    const frequency = Utils.toNumber(form.frequency.value) || 1;
    const isPercentage = form.isPercentage.checked || false;
    const teams = Utils.toArray(form.teams.value) || [];

    return {
      startDate: startDate,
      endDate: endDate,
      frequency: frequency,
      isPercentage: isPercentage,
      teams: teams,
    };
  }

  static createUrl(config) {
    return `/api/metrics?startDate=${config.startDate}&endDate=${
      config.endDate
    }&frequency=${config.frequency}&isPercentage=${
      config.isPercentage
    }&teams=${config.teams.join(',')}&format=${config.format}`;
  }
}

export { MetricsService };
