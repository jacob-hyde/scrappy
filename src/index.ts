const { program } = require("commander");
import Scrappy from "./Scrappy";

program
  .option("--verbose", "Verbose output")
  .option("-s --scraper [scraper...]", "Run a specific scraper");

program.parse();

const options = program.opts();
Scrappy.setOptions(options);

async function main() {
  await Scrappy.run();
}

main();

// async function main() {
//   const queue = Scrappy.createQueue("test", false);
//   //generate 100 random jobs with differnt job names and data
//   for (let i = 0; i < 5; i++) {
//     const jobName = `job-${i}`;
//     const data = { i };
//     await queue.addJob(jobName, data);
//   }

//   queue.process();
// }

// main();
