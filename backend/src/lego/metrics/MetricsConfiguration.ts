class MetricsConfiguration {
  startDate: Date;
  endDate: Date;
  frequencyInDays: number;
  isPercentage?: boolean = false;
  teams?: string[];
  format?: string = 'json';
}
