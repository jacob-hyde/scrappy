export type Scrapers = {
  [key: string]: Scraper;
};

export type Scraper = {
  name: string;
  processor: any;
  url: string;
  collection: string;
  sandbox?: boolean;
  queue?: string;
  options?: ScraperOptions;
};

export type ScraperOptions = {
  cluster?: boolean;
};
