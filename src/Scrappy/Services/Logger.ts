import Config from "./Config";
import ILogger from "./Interfaces/Logger";

export default class Logger {
  constructor(public logService: ILogger, protected config: Config) {}
}
