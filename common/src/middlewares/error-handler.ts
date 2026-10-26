import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// Always send back one consistent error structure: { errors: [{ message, field? }] }.
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err); // So that it's easier to debug.
  res.status(400).send({
    errors: [{ message: "Something went wrong!" }],
  });
};
