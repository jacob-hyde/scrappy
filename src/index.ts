import Scrappy from "./Scrappy";

async function main() {
  const queue = Scrappy.createQueue("test", true);
  //generate 100 random jobs with differnt job names and data
  for (let i = 0; i < 5; i++) {
    const jobName = `job-${i}`;
    const data = { i };
    await queue.addJob(jobName, data);
  }

  queue.process();
}

main();
