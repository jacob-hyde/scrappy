import { Container } from "brandi";
import { bindRegistrators, getRegistrator } from "./Container/BindRegistrators";
import Queue from "./Queue/Queue";

class Scrappy {
  private static instance: Scrappy | null = null;
  private container: Container;
  public queues: Map<string, Queue> = new Map();
  public initialized: boolean = false;
  private isDeserializing: boolean = false;
  private didDeserialize: boolean = false;

  private constructor() {
    this.container = new Container();
    bindRegistrators(this.container);
  }

  // Instead of immediately creating an instance, this method will check if the instance exists
  public static getInstance(): Scrappy {
    if (!Scrappy.instance) {
      throw new Error(
        "Scrappy instance is not initialized. Call initialize or deserialize first."
      );
    }
    return Scrappy.instance;
  }

  // New method to explicitly initialize the instance
  public static initialize(): Scrappy {
    if (!Scrappy.instance) {
      const instance = new Scrappy();
      Scrappy.instance = Scrappy.applyProxy(instance);
      Scrappy.instance.initialized = true;
    }
    return Scrappy.instance;
  }

  public static deserialize(serializedData: any): Scrappy {
    if (!Scrappy.instance) {
      const instance = new Scrappy();
      instance.isDeserializing = true;
      Scrappy.instance = Scrappy.applyProxy(instance);
    }

    Scrappy.instance.initialized = serializedData.initialized;
    Scrappy.instance.didDeserialize = true;
    console.log(serializedData.queueNames);
    for (const queueName of serializedData.queueNames) {
      Scrappy.instance.createQueue(queueName);
    }

    Scrappy.instance.isDeserializing = false;
    return Scrappy.instance;
  }

  public service(token: string): any {
    return getRegistrator(this.container, token);
  }

  public config(): any {
    return getRegistrator(this.container, "config");
  }

  public createQueue(name: string, sandboxProcess: boolean = false): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name) as Queue;
    }

    const queue = new Queue(name, this.config());
    if (!this.didDeserialize) {
      queue.createWorker(name, sandboxProcess);
    }
    this.queues.set(name, queue);
    this.cacheSerializedData();
    return queue;
  }

  public getQueue(name: string): Queue {
    return this.queues.get(name) as Queue;
  }

  public serialize(): string {
    return JSON.stringify({
      initialized: this.initialized,
      queueNames: Array.from(this.queues.values()).map((queue) => queue.name),
    });
  }

  private async cacheSerializedData(): Promise<void> {
    const cache = this.service("cache");
    await cache.cache("scrappy", this.serialize());
  }

  private static applyProxy(instance: Scrappy): Scrappy {
    const cache = instance.service("cache");

    const handler: ProxyHandler<Scrappy> = {
      set(target, property, value) {
        if (instance.isDeserializing) {
          return Reflect.set(target, property, value);
        }

        if (target[property as keyof Scrappy] !== value) {
          console.log(property, value);
          const result = Reflect.set(target, property, value);
          const serializedData = target.serialize();
          cache.cache("scrappy", serializedData);
          return result;
        }
        return true;
      },
      deleteProperty(target, property) {
        if (instance.isDeserializing) {
          return Reflect.deleteProperty(target, property);
        }

        const result = Reflect.deleteProperty(target, property);
        const serializedData = target.serialize();
        cache.cache("scrappy", serializedData);
        return result;
      },
    };

    return new Proxy(instance, handler);
  }
}

export default Scrappy;
