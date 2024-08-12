import ServicesConfig from "./../../Config/Services";

export default class Config {
  protected config: Map<string, string | null> = new Map<
    string,
    string | null
  >();

  constructor() {
    this.setInitialConfig();
  }

  public get(key: string): string | null {
    return this.config.get(key) as string | null;
  }

  public set(key: string, value: string | null): void {
    this.config.set(key, value);
  }

  private setInitialConfig(): void {
    for (const [key, value] of Object.entries(ServicesConfig)) {
      this.config.set(key, value);
    }
  }
}
