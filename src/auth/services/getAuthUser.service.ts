import { ControllerArgs, UnAuthorizedError, responseHandler } from "../../core"
import { Users } from "../models/user.model"

export class GetAuthUser {
  constructor(private readonly dbUser: typeof Users) {}

  handle = async ({ user }: ControllerArgs<any>) => {
    // Extract email and password from input

    if (!user) throw new UnAuthorizedError("Unauthorized")

    try {
      // Find the user by email and throw error if user exists
      const currentUser = await this.dbUser.findOne({
        where: {
          id: user.id,
        },
      })

      if (!currentUser) {
        throw new UnAuthorizedError("Invalid User")
      }

      // Return a successful response using the ResponseHandler utility
      return responseHandler.responseSuccess(
        200,
        "User Found successfully",
        currentUser,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Finding User ${error?.message}`,
      )
    }
  }
}
