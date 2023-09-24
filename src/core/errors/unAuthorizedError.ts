import { HttpStatus } from "../utils";
import { ApiError, ErrorDetailsDescriptor } from "./apiError";

export class UnAuthorizedError extends ApiError {
  _statusCode = HttpStatus.UNAUTHORIZED;
  _message: string;
  _details = null;

  constructor(message: string, details?: string) {
    super(message);
    this._message = message;
    this._statusCode = HttpStatus.UNAUTHORIZED;

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get message(): string {
    return this._message;
  }

  get details(): ErrorDetailsDescriptor {
    return this._details;
  }
}
