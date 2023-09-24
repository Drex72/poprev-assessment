import { Response, Request, NextFunction } from "express"
import { HttpStatus, joiValidate, parseControllerArgs } from "../utils"
import {
  AnyFunction,
  ControllerHandlerOptions,
  ExpressCallbackFunction,
  Roles,
  ValidationSchema,
} from "../types"
import { UnAuthorizedError, UnProcessableError } from "../errors"
import { authGuard } from "../../auth/services"

export class ControllerHandler {
  handle = (
    controllerFn: AnyFunction,
    schema: ValidationSchema | undefined = {},
    options?: ControllerHandlerOptions,
  ): ExpressCallbackFunction => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (options?.isPrivate) {
          await this.validateRequest(req, options)
        }

        const controllerArgs = parseControllerArgs.parse(req)
        const { input, params, query } = controllerArgs

        if (schema) {
          const { querySchema, paramsSchema, inputSchema } = schema

          try {
            if (inputSchema) joiValidate(inputSchema, input)
            if (querySchema) joiValidate(querySchema, query)
            if (paramsSchema) joiValidate(paramsSchema, params)
          } catch (error: any) {
            throw new UnProcessableError(error.message.replaceAll('"', ""))
          }
        }

        const controllerResult = await controllerFn(controllerArgs, res, req)
        if (!controllerResult) {
          res.status(HttpStatus.OK).send({ status: true })
          return
        }

        const { statusCode, ...data } = controllerResult
        res.status(statusCode ?? HttpStatus.OK).send(data)
      } catch (error) {
        next(error)
      }
    }
  }

  private async validateRequest(
    req: Request,
    options: ControllerHandlerOptions,
  ) {
    const isRequestAllowed = await authGuard.guard(req.cookies)

    if (!isRequestAllowed) throw new UnAuthorizedError("Unauthorized")

    if (options?.allowedRoles && options.allowedRoles.length > 0) {
      const isRequestAuthorized = options.allowedRoles?.includes(
        isRequestAllowed.role.toLocaleUpperCase() as Roles,
      )

      if (!isRequestAuthorized) throw new UnAuthorizedError("Unauthorized")
    }

    req.user = isRequestAllowed
  }
}
