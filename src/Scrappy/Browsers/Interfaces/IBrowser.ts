import { PuppeteerLaunchOptions } from "puppeteer";

export default interface IBrowser {
  browserArguments: Array<string>;
  browserOptions: PuppeteerLaunchOptions;
}