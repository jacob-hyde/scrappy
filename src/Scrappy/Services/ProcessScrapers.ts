import { Scraper } from "../../Config/Types/Scraper";
import Scrapers from "../../Config/Scrapers";
import Cache from "./Cache";
import Config from "./Config";
import Logger from "./Interfaces/Logger";
import Scrappy from "..";

export default class ProcessScrapers {
  public scrapers: Map<string, Scraper> = new Map(Object.entries(Scrapers));
  private scrapersToRun: Array<string> = [];

  constructor(
    private config: Config,
    private logger: Logger,
    private cache: Cache
  ) {
    this.scrapersToRun = Scrappy.options.scraper || Object.keys(Scrapers);
    console.log(this.scrapersToRun);
  }

  public async run(): Promise<void> {
    await Promise.all(
      this.scrapersToRun.map(async (scraperName) => {
        const scraper = this.scrapers.get(scraperName);
        if (!scraper) {
          this.logger.error(`Scraper ${scraperName} not found`);
          return;
        }
      })
    );
  }
}
