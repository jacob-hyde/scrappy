const puppeteer = require("puppeteer-extra");
import { Browser as PBrowser } from "puppeteer";
import BaseBrowser from "./BaseBrowser";

export default class Browser extends BaseBrowser {
  protected instance!: PBrowser;

  public async launch(): Promise<void> {
    this.instance = await puppeteer.launch(this.browserOptions);
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
