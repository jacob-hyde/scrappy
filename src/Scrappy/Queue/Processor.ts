import { Job, SandboxedJob } from "bullmq";

module.exports = async (job: Job | SandboxedJob) => {
  console.log(job.data);
};
