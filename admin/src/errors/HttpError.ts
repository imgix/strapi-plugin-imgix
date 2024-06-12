export type Details = {
  message: string;
  path: string;
}
export class HttpError<T extends unknown = unknown> extends Error {
  response?: T;

  constructor(message: string, response?: T) {
    super();
    this.message = message;
    this.response = response;
  }
}

