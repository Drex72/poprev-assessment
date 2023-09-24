import { HttpStatus } from '../utils';
import { ApiError, ErrorDetailsDescriptor } from './apiError';

export class BadRequestError extends ApiError {
    _statusCode = HttpStatus.BAD_REQUEST;
    _message: string;
    _details = null;
    
    constructor(message : string) {
        super(message);
        this._message = message;

        Object.setPrototypeOf(this, BadRequestError.prototype);
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
};