export class HttpError extends Error {
  status: number;

  constructor(public readonly response: Response) {
    super(response.statusText);
    this.name = 'HttpError';
    this.status = response.status;
  }
}
