import { Request, Response } from "express"
import {
  ConflictError,
  ControllerArgs,
  UnAuthorizedError,
  cookieHandler,
  responseHandler,
} from "../../core"
import { Users } from "../models/user.model"

export class Logout {
  constructor(private readonly dbUsers: typeof Users) {}
  handle = async ({ user }: ControllerArgs<any>, res: Response) => {
    if (!user) throw new ConflictError("User not found")

    try {
      const currentUser = await this.dbUsers.findOne({
        where: { id: user.id },
      })

      if (!currentUser) throw new UnAuthorizedError("Unauthorized")

      await this.dbUsers.update(
        { refreshToken: "" },
        { where: { id: user.id } },
      )

      cookieHandler.clearHttpOnlyCookie({ cookieName: "accessToken", res })
      cookieHandler.clearHttpOnlyCookie({ cookieName: "refreshToken", res })

      return responseHandler.responseSuccess(204, "Logged out Successfully")
    } catch (error: any) {
      return responseHandler.responseSuccess(
        400,
        `Error Logging Out ${error?.message}`,
      )
    }
  }
}
