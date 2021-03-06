class Utils {
  static addDays(dateString) {
    const referenceDate = new Date(dateString);
    const datePlusOneDay = new Date(dateString).setUTCDate(
      referenceDate.getUTCDate() + 1
    );
    const date = new Date(datePlusOneDay);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }

  static toNumber(value) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      return null;
    }
    return numberValue;
  }

  static toArray(value) {
    if (!value) {
      return null;
    }
    return value.split(',');
  }

  static toDateString(theDate) {
    return theDate.toJSON().slice(0, 10);
  }
}

export { Utils };
