const path = require("path");
const ProcessJob = require("./Processor");
import { Queue as BQueue, Worker, Job, QueueEvents } from "bullmq";
import Config from "../Services/Config";

type Connection = {
  host: string;
  port: number;
  maxRetriesPerRequest: null;
};

type BulkJobs = Array<{ name: string; data: any; opts?: Object }>;

export default class Queue {
  public queue: BQueue;
  public workers: Map<string, Worker> = new Map();
  private concurrency: number = 1;
  constructor(public name: string, private config: Config) {
    this.queue = new BQueue(name, {
      prefix: "queue",
      connection: this.getConnection(),
    });
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

  public process(workerName?: string): void {
    if (workerName) {
      const worker = this.workers.get(workerName);
      if (!worker) {
        throw new Error(`Worker ${workerName} not found`);
      }
      this.runWorker(worker);
      return;
    }

    for (const worker of this.workers.values()) {
      this.runWorker(worker);
    }
  }

  public createWorker(
    name: string = this.queue.name,
    isSandboxProcess: boolean = false
  ): void {
    const workerOptions = {
      prefix: "queue",
      autorun: false,
      concurrency: this.concurrency,
      connection: this.getConnection(),
    };

    let worker: Worker;
    if (isSandboxProcess) {
      worker = new Worker(
        name,
        path.join(__dirname, "Processor.js"),
        workerOptions
      );
    } else {
      worker = new Worker(name, ProcessJob, workerOptions);
    }

    worker.on("failed", (job, err) => {
      console.log(`Job ${job!.id} failed with error ${err.message}`);
    });

    worker.on("error", (err) => {
      console.log(`Worker error: ${err.message}`);
    });

    this.queue.on("error", (err) => {
      console.log(`Queue error: ${err.message}`);
    });

    const queueEvents = new QueueEvents(this.queue.name, {
      connection: this.getConnection(),
    });

    queueEvents.on("completed", (jobId) => {
      console.log(`Job ${jobId} has completed`);
    });

    queueEvents.on("failed", (jobId, err) => {
      console.log(`Job ${jobId} has failed with error ${err}`);
    });

    this.workers.set(name, worker);
  }

  private runWorker(worker: Worker): void {
    if (worker.isRunning() && !worker.isPaused()) {
      return;
    } else if (worker.isPaused()) {
      worker.resume();
      return;
    }
    worker.run();
  }

  private getConnection(): Connection {
    return {
      host: this.config.get("REDIS_HOST")!,
      port: parseInt(this.config.get("REDIS_PORT")!),
      maxRetriesPerRequest: null,
    };
  }
}

function printStackTrace() {
  try {
    throw new Error("Stack trace generator");
  } catch (e) {
    if (e instanceof Error) {
      const stack = e.stack || "";
      const formattedStack = stack
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) => line && !line.includes("Error: Stack trace generator")
        )
        .join("\n");

      console.log("Stack Trace:\n", formattedStack);
    } else {
      console.log("Unknown error type:", e);
    }
  }
}
