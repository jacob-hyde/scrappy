import IService from "./IService";

export default interface ILogger extends IService {
  log(message: string): void;
  error(message: string): void;
}
