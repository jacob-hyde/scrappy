const { Cluster } = require("puppeteer-cluster");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const puppeteer = require("puppeteer-extra");
import { Browser, PuppeteerLaunchOptions, executablePath } from "puppeteer";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
import IBrowser from "./Interfaces/IBrowser";
import Config from "../Services/Config";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export default abstract class BaseBrowser implements IBrowser {
  protected abstract instance: Browser | typeof Cluster;
  protected headless: boolean = true;

  constructor(protected config: Config) {}

  public browserArguments: Array<string> = [
    "--no-sandbox",
    "--proxy-server=brd.superproxy.io:22225",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"',
  ];

  public browserOptions: PuppeteerLaunchOptions = {
    args: this.browserArguments,
    headless: this.headless ? "new" : false,
    ignoreHTTPSErrors: true,
    executablePath: executablePath(),
    timeout: 0,
    protocolTimeout: 0,
    userDataDir: this.getUserDataDir(),
  };

  public setHeadless(headless: boolean): void {
    this.headless = headless;
  }

  protected getUserDataDir(): string {
    const tmpPath = path.join(__dirname, `./puppeteer-tmp`);
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath, { recursive: true });
    }
    const PUPPETEER_DIR = path.join(
      tmpPath,
      `puppeteer-${crypto.randomUUID()}`
    );
    return path.join(PUPPETEER_DIR, "profile");
  }

  public abstract launch(): Promise<void>;
  public abstract close(): Promise<void>;
}
