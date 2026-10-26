import { CustomError } from "./custom-error";

// Thrown when the request makes sense but we can't do it (e.g. ticket already reserved).
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
