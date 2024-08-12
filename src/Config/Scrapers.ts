import { Scrapers } from "./Types/Scraper";

const config: Scrapers = {
  example: {
    name: "example",
    processor: null,
    url: "https://example.com",
    collection: "example",
    options: {
      cluster: true,
    },
  },
};

export default config;
