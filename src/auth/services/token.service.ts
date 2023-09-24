import jwt from "jsonwebtoken"
import {
  IAccessTokenSignedPayload,
  IEncryptor,
  IRefreshTokenSignedPayload,
  ITokenService,
} from "../dto"
import { config } from "../../core"
import { Roles, Users } from "../models"

export class TokenService implements ITokenService {
  constructor(
    private readonly encryptor: IEncryptor,
    private readonly dbUser: typeof Users,
  ) {}

  public createAndEncryptAccessToken = (
    payload: IAccessTokenSignedPayload,
  ): string => {
    const { accessTokenExpiresIn, accessTokenSecret } = config.auth
    const token = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    })
    return this.encryptor.encryptString(token)
  }

  public createAndEncryptRefreshToken(
    payload: IRefreshTokenSignedPayload,
  ): string {
    const { refreshTokenExpiresIn, refreshTokenSecret } = config.auth
    const token = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    })
    return this.encryptor.encryptString(token)
  }

  public isAccessTokenValid = async (
    token: string,
  ): Promise<boolean | IAccessTokenSignedPayload> => {
    try {
      const { accessTokenSecret } = config.auth

      const userPayload = jwt.verify(
        token,
        accessTokenSecret,
      ) as IAccessTokenSignedPayload

      if (!userPayload) return false

      const user:any = await this.dbUser.scope("withRefreshToken").findOne({
        where: { id: userPayload.id },
        include: [
          {
            model: Roles,
            as: "role", 
            attributes: ["roleName"], 
          },
        ],
      })

      if (!user) return false

      if (userPayload.refreshToken !== user.refreshToken) return false

      return {
        id: user.id,
        role: user?.role.roleName,
        refreshToken: userPayload.refreshToken,
      }
    } catch (error) {
      return false
    }
  }

  public isRefreshTokenValid = async (
    token: string,
  ): Promise<false | Users> => {
    const { refreshTokenSecret } = config.auth

    const userPayload = jwt.verify(
      token,
      refreshTokenSecret,
    ) as IRefreshTokenSignedPayload

    if (!userPayload) return false

    const user = await this.dbUser.scope("withRefreshToken").findOne({
      where: { id: userPayload.id },
    })

    if (!user) return false

    return user
  }

  public decryptToken = (token: any) => {
    const decryptedToken = this.encryptor.decrypt(token)
    if (!decryptedToken) return

    return decryptedToken
  }
}
