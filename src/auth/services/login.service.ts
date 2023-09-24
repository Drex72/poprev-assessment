import { Response } from "express"
import {
  ControllerArgs,
  UnAuthorizedError,
  compareHashedData,
  cookieHandler,
  logger,
  responseHandler,
} from "../../core"
import { Users } from "../models/user.model"
import { ITokenService, LoginDTO } from "../dto"

export class Login {
  constructor(
    private readonly dbUser: typeof Users,
    private readonly tokenService: ITokenService,
  ) {}

  handle = async ({ input }: ControllerArgs<LoginDTO>, res: Response) => {
    const { email, password } = input!

    try {
      // Find the user by email
      const user: any = await this.dbUser.scope('withPassword').findOne({
        where: { email },
      })

      if (!user) throw new UnAuthorizedError("Invalid login credentials")

      const isValid = await compareHashedData(password, user.password!)
      if (!isValid) throw new UnAuthorizedError("Invalid login credentials")

      const refreshToken = this.tokenService.createAndEncryptRefreshToken({
        id: user.id,
      })

      const accessToken = this.tokenService.createAndEncryptAccessToken({
        id: user.id,
        role: "",
        refreshToken,
      })

      // Store RefreshToken in Db
      await this.dbUser.update(
        { refreshToken, refreshTokenExp: new Date() },
        { where: { email } },
      )

      cookieHandler.saveToHttpOnlyCookie({
        cookieName: "refreshToken",
        data: refreshToken,
        res,
      })

      cookieHandler.saveToHttpOnlyCookie({
        cookieName: "accessToken",
        data: accessToken,
        res,
      })

      delete user.password

      logger.info("Logged In Successfully")

      return responseHandler.responseSuccess(200, "Logged In Successfully", {
        user,
      })
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Logging In ${error?.message}`,
      )
    }
  }
}
