import { Container } from "brandi";
import { bindRegistrators, getRegistrator } from "./Container/BindRegistrators";
import Queue from "./Queue/Queue";

class Scrappy {
  private container: Container;
  public queues: Map<string, Queue> = new Map();

  constructor() {
    this.container = new Container();
    bindRegistrators(this.container);
  }

  public service(token: string): any {
    return getRegistrator(this.container, token);
  }

  public config(): any {
    return getRegistrator(this.container, "config");
  }

  public createQueue(name: string): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name) as Queue;
    }
    return this.queues
      .set(name, new Queue(name, false, this.config()))
      .get(name) as Queue;
  }

  public createProcessQueue(name: string): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name) as Queue;
    }
    return this.queues
      .set(name, new Queue(name, true, this.config()))
      .get(name) as Queue;
  }

  public getQueue(name: string): Queue {
    return this.queues.get(name) as Queue;
  }
}

export = new Scrappy();
