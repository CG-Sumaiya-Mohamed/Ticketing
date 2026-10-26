// Every custom error must have a status code and a serializeErrors() method so all services send back the same error structure.
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);
    // Required anytime we extend a built in class.
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
