export class Utils {
  static toPrettyDate(theValue: string): string {
    let theDate: Date = new Date(theValue),
      month = '' + (theDate.getMonth() + 1),
      day = '' + theDate.getDate(),
      year = theDate.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  static now(): Date {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}
