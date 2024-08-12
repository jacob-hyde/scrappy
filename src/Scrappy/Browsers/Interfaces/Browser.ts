import { PuppeteerLaunchOptions } from "puppeteer";

export default interface Browser {
  browserArguments: Array<string>;
  browserOptions: PuppeteerLaunchOptions;
}
