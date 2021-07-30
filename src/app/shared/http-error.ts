export class HttpError extends Error {
  constructor(public readonly response: Response) {
    super(response.statusText);
    this.name = 'HttpError';
  }
}
