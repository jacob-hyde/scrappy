const puppeteer = require("puppeteer-extra");
import { Browser as PBrowser } from "puppeteer";
import BrowserBase from "./BrowserBase";

export default class Browser extends BrowserBase {
  protected instance!: PBrowser;

  public async launch(): Promise<void> {
    this.instance = await puppeteer.launch(this.browserOptions);
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
