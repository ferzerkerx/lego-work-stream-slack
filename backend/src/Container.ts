export class Container {
  static instance: Container = new Container();

  private static entries: Map<string, string> = new Map<string, string>();

  private constructor() {}

  static register(identifier: any, instance: any) {
    this.entries.set(identifier.toString(), instance);
  }

  static resolve<T>(identifier: any): T {
    // @ts-ignore
    return this.entries.get(identifier.toString());
  }
}
