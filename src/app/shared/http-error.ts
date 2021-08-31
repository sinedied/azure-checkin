export class HttpError extends Error {
  constructor(public readonly response: Response, message?: string) {
    super(message || response.statusText);
    this.name = 'HttpError';
  }
}
