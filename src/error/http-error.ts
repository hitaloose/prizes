export class HTTPError extends Error {
  constructor(message: string, status = 400) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }

  status: number;
}
