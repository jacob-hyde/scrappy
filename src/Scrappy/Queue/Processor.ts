import { Job, SandboxedJob } from "bullmq";
import Scrappy from "../Scrappy";
import Cache from "../Services/Cache";
import Config from "../Services/Config";
import ConsoleLogger from "../Services/Loggers/ConsoleLogger";

const ProcessorSetup = async (): Promise<Scrappy> => {
  const cache = new Cache(new Config(), new ConsoleLogger());
  const scrappyDeserialized = await cache.get("scrappy");

  if (scrappyDeserialized) {
    return Scrappy.deserialize(scrappyDeserialized);
  }
  return Scrappy.initialize();
};

module.exports = async (job: Job | SandboxedJob) => {
  const scrappy = await ProcessorSetup();

  // console.log(scrappy.getQueue("test"));

  // Now you can interact with Scrappy as expected
};
