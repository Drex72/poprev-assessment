import { ControllerHandler } from "./controllerHandler"
import { ErrorHandler } from "./errorhandler"
import { CookieHandler } from "./cookieHandler"
import { NotFoundErrorHandler } from "./notFoundErrorHandler"
import { ResponseHandler } from "./responseHandler"

export const controllerHandler = new ControllerHandler()
export const errorHandler = new ErrorHandler()
export const notFoundHandler = new NotFoundErrorHandler()
export const responseHandler = new ResponseHandler()
export const cookieHandler = new CookieHandler()
