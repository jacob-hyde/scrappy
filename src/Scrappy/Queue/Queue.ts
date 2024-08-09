const path = require("path");
const ProcessJob = require("./Processor");
import { Queue as BQueue, Worker, Job } from "bullmq";
import { default as IORedis } from "ioredis";
import Scrappy from "..";
import Config from "../Services/Config";

type Connection = {
  host: string;
  port: number;
  maxRetriesPerRequest: null;
};

type BulkJobs = Array<{ name: string; data: any; opts?: Object }>;

export default class Queue {
  public queue: BQueue;
  private worker!: Worker;
  private workers: number = 3;
  private redisConnection: IORedis;
  constructor(public name: string, private useProcessor: boolean = false, private config: Config) {
    this.redisConnection = new IORedis(this.getConnection());
    this.queue = new BQueue(name, {
      prefix: "queue",
      connection: this.redisConnection,
    });
    this.createWorker();
  }

  public async addJob(jobName: string, data: any = {}): Promise<Job> {
    return await Job.create(this.queue, jobName, data, {
      debounce: { id: jobName, ttl: 30000 },
    });
  }

  public async addJobs(jobs: BulkJobs): Promise<Job[]> {
    jobs = jobs.map((job) => {
      return {
        ...job,
        opts: {
          debounce: { id: job.name, ttl: 30000 },
        },
      };
    });
    return Job.createBulk(this.queue, jobs);
  }

  public process(): void {
    if (this.worker.isRunning() && !this.worker.isPaused()) {
      return;
    } else if (this.worker.isPaused()) {
      this.worker.resume();
      return;
    }
    this.worker.run();
  }

  private createWorker(): void {
    const workerOptions = {
      prefix: "queue",
      autorun: false,
      concurrency: this.workers,
      connection: this.redisConnection,
    };

    if (this.useProcessor) {
      this.worker = new Worker(
        this.queue.name,
        path.join(__dirname, "Processor.js"),
        workerOptions
      );
      return;
    }

    this.worker = new Worker(this.queue.name, ProcessJob, workerOptions);
  }

  private getConnection(): Connection {
    return {
      host: this.config.get("REDIS_HOST")!,
      port: parseInt(this.config.get("REDIS_PORT")!),
      maxRetriesPerRequest: null,
    };
  }
}
