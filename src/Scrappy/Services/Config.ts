import IService from "./Interfaces/IService";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./../.env") });

export default class Config implements IService {
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
    this.config.set("NODE_ENV", process.env.NODE_ENV || "local");
    this.config.set("LOGGER", process.env.LOGGER || "console");
    this.config.set("LOGGER_LEVEL", process.env.LOGGER_LEVEL || "debug");
    this.config.set(
      "MONGO_HOST",
      process.env.MONGO_HOST || "mongodb://127.0.0.1:27017"
    );
    this.config.set("MONGO_TLS_CA", process.env.MONGO_TLS_CA || null);
    this.config.set("MONGO_TLS_CERT", process.env.MONGO_TLS_CERT || null);
    this.config.set("MONGO_DB", process.env.MONGO_DB || "scrappy");
    this.config.set("MONGO_USER", process.env.MONGO_USER || null);
    this.config.set("MONGO_PASS", process.env.MONGO_PASS || null);
    this.config.set("MONGO_AUTH_DB", process.env.MONGO_AUTH_DB || null);
    this.config.set("REDIS_HOST", process.env.REDIS_HOST || "127.0.0.1");
    this.config.set("REDIS_PORT", process.env.REDIS_PORT || "6379");
    this.config.set("REDIS_PASS", process.env.REDIS_PASS || null);
  }
}
