import { Queue as BQueue, Job as BJob } from "bullmq";
const Job = async (
  queue: BQueue,
  jobName: string,
  data: any = {}
): Promise<BJob> => {
  return await BJob.create(queue, jobName, data, {
    debounce: { id: jobName, ttl: 30000 },
  });
};

export default Job;
