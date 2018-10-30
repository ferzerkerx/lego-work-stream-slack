export class ProcessStatistics {
  static triggers: number = 0;
  static convos: number = 0;

  static formatUptime(uptime: number): string {
    let unit: string = 'second';
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = 'minute';
    }
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = 'hour';
    }
    if (uptime != 1) {
      unit = unit + 's';
    }
    return `${uptime} ${unit}`;
  }
}
