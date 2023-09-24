import { Response } from "express"
import {
  ControllerArgs,
  UnAuthorizedError,
  cookieHandler,
  responseHandler,
} from "../../core"
import { ITokenService } from "../dto"
import { Users } from "../models"

export class RefreshAccessToken {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly dbUser: typeof Users,
  ) {}

  public refresh = async ({ cookies }: ControllerArgs<any>, res: Response) => {
    try {
      const cookieRefreshToken = cookies?.refreshToken

      if (!cookieRefreshToken) throw new UnAuthorizedError("Unauthorized")

      const refreshToken = this.tokenService.decryptToken(cookieRefreshToken)

      if (!refreshToken) throw new UnAuthorizedError("Unauthorized")

      const user = await this.tokenService.isRefreshTokenValid(refreshToken)

      if (!user) throw new UnAuthorizedError("Unauthorized")

      if (this.tokenService.decryptToken(user?.refreshToken) !== refreshToken)
        throw new UnAuthorizedError("Unauthorized")

      const newRefreshToken = this.tokenService.createAndEncryptRefreshToken({
        id: user.id,
      })

      const accessToken = this.tokenService.createAndEncryptAccessToken({
        id: user.id,
        role: user.roleId,
        refreshToken,
      })

      cookieHandler.saveToHttpOnlyCookie({
        cookieName: "refreshToken",
        data: newRefreshToken,
        res,
      })

      cookieHandler.saveToHttpOnlyCookie({
        cookieName: "accessToken",
        data: accessToken,
        res,
      })

      // Store RefreshToken in Db
      await this.dbUser.update(
        { refreshToken, refreshTokenExp: new Date() },
        { where: { id: user.id } },
      )

      return responseHandler.responseSuccess(
        204,
        "Token Refreshed Successfully",
      )
    } catch (error: any) {
      console.log(error)
      return responseHandler.responseError(
        400,
        `Error Refreshing Token ${error?.message}`,
      )
    }
  }
}
