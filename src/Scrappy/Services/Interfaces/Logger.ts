import Service from "./Service";

export default interface Logger extends Service {
  log(message: string): void;
  error(message: string): void;
}
