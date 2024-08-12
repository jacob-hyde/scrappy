import { token, tag, Container, Tag, Token } from "brandi";
import Config from "../Services/Config";
import Logger from "../Services/Logger";
import ILogger from "../Services/Interfaces/Logger";
import ConsoleLogger from "../Services/Loggers/ConsoleLogger";
import Cache from "../Services/Cache";
import Browser from "../Browsers/Browser";
import ProcessScrapers from "../Services/ProcessScrapers";

const Tokens = {
  config: token<Config>("config"),
  logService: token<ILogger>("logService"),
  consoleLogger: token<ConsoleLogger>("consoleLogger"),
  logger: token<Logger>("logger"),
  cache: token<Cache>("cache"),
  browser: token<Browser>("browser"),
  processScrapers: token<ProcessScrapers>("processScrapers"),
};

const Tags = {
  consoleLogger: tag("consoleLogger"),
};

type DefaultInterfaceImplementation = Map<Token<any>, any>;

const DefaultInterfaceImplementations: DefaultInterfaceImplementation = new Map(
  [[Tokens.logService, ConsoleLogger]]
);

type TagOptions = {
  tag: Tag;
  bind: Token<any>;
  instance: any;
  callback: (...args: any[]) => boolean;
};

type ClassTags = Array<TagOptions>;

type ClassOptions = {
  class: any;
  singleton?: boolean;
  tokens?: Array<Token<any>>;
  tags?: ClassTags;
};

type ClassesMap = Map<string, ClassOptions>;

const Classes: ClassesMap = new Map([
  ["config", { class: Config, singleton: true }],
  ["consoleLogger", { class: ConsoleLogger, singleton: true }],
  [
    "logger",
    {
      class: Logger,
      singleton: true,
      tokens: [Tokens.logService, Tokens.config],
      tags: [
        {
          tag: Tags.consoleLogger,
          bind: Tokens.logService,
          instance: ConsoleLogger,
          callback: (container: Container) => {
            return container.get(Tokens.config).get("LOGGER") === "console";
          },
        },
      ],
    },
  ],
  [
    "cache",
    {
      class: Cache,
      singleton: true,
      tokens: [Tokens.config, Tokens.logService],
    },
  ],
  [
    "browser",
    {
      class: Browser,
      singleton: false,
      tokens: [Tokens.config],
    },
  ],
  [
    "processScrapers",
    {
      class: ProcessScrapers,
      singleton: true,
      tokens: [Tokens.config, Tokens.logService, Tokens.cache],
    },
  ],
]);

export { Classes, Tokens, DefaultInterfaceImplementations };
