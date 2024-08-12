import Config from "./Config";
import ILogger from "./Interfaces/Logger";
const redis = require("redis");

export default class Cache {
  private client: any;

  constructor(private config: Config, private logger: ILogger) {
    this.connect();
  }

  private connect() {
    this.client = redis.createClient({
      url: `redis://${this.config.get("REDIS_HOST")}:${this.config.get(
        "REDIS_PORT"
      )}`,
      socket: {
        connectTimeout: 3000,
        rejectUnauthorized: false,
        reconnectStrategy: (attempts: number): number | Error => {
          this.logger.log(`Redis reconnecting attempt: ${attempts}`);
          return 3000;
        },
      },
    });

    this.client.on("error", this.onError.bind(this));
    this.client.on("reconnecting", this.onReconnecting.bind(this));

    this.client.connect();
  }

  /**
   * Set or get a value from the cache
   * @param key The key to cache
   * @param value The value to cache
   * @param expiration The expiration time in seconds
   * @returns The cached value or null if the key does not exist
   */
  public async cache(
    key: string,
    value?: any,
    expiration?: number
  ): Promise<any> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    if (value) {
      if (typeof value === "object" || Array.isArray(value)) {
        value = JSON.stringify(value);
      }
      if (expiration) {
        return await this.client.set(key, value, { EX: expiration });
      } else {
        return await this.client.set(key, value);
      }
    }

    if (key.includes("*")) {
      const keys = await this.client.keys(key);
      let values: { [key: string]: any } = {};
      for (const key of keys) {
        const value = await this.client.get(key);
        try {
          values = { ...values, ...JSON.parse(value) };
        } catch (e) {
          values[key] = value;
        }
      }
      return values;
    }

    let cachedValue = await this.client.get(key);

    if (cachedValue === null) {
      return null;
    }

    try {
      cachedValue = JSON.parse(cachedValue);
    } catch (e) {
      // do nothing
    }

    return cachedValue;
  }

  public async get(key: string): Promise<any> {
    return await this.cache(key);
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async appendCache(key: string, value: any): Promise<void> {
    if (!(await this.client.exists(key))) {
      await this.client.set(key, "{}");
    }
    let cachedValue = await this.client.get(key);
    if (cachedValue === null) {
      return;
    }
    try {
      cachedValue = JSON.parse(cachedValue);
    } catch (e) {
      // do nothing
    }
    cachedValue = Object.assign({}, cachedValue, value);
    await this.client.set(key, JSON.stringify(cachedValue));
  }

  public on(event: string, callback: (...args: [any]) => void): void {
    this.client.on(event, callback);
  }

  public async flush(): Promise<void> {
    await this.client.flushAll();
  }

  private onError(err: any) {
    this.logger.error("Redis Client Error\n" + err);
  }

  private onReconnecting() {
    this.logger.log("Redis Client Reconnecting");
  }
}
