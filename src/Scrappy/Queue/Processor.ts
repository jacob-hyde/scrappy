import { Job, SandboxedJob } from "bullmq";
import Scrappy from "../Scrappy";
import Cache from "../Services/Cache";
import Config from "../Services/Config";
import ConsoleLogger from "../Services/Loggers/ConsoleLogger";

module.exports = async (job: Job | SandboxedJob) => {
  const cache = new Cache(new Config(), new ConsoleLogger());
  const scrappySerialized = await cache.get("scrappy");

  if (scrappySerialized) {
    Scrappy.deserialize(scrappySerialized);
  } else {
    Scrappy.initialize();
  }

  // Now you can interact with Scrappy as expected
};
