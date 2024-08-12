import ILogger from "../Interfaces/Logger";

export default class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}
