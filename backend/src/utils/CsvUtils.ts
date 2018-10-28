export class CsvUtils {
  static toCsv(data: string[][]): string {
    return data
      .map(rowItems => {
        return (
          rowItems
            .map(colItem => `"${this.sanitizeValue(colItem)}"`)
            .toString() + '\r\n'
        );
      })
      .join('');
  }

  private static sanitizeValue(rawValue) {
    const colValue = rawValue || '';
    return colValue.toString().replace(/\"/g, '""');
  }
}
