import { IAccessTokenSignedPayload, ITokenService } from "../dto"

export class AuthGuard {
  constructor(
    private readonly tokenService: ITokenService,
  ) {}

  public guard = async (
    cookies: any,
  ): Promise<false | IAccessTokenSignedPayload> => {
    const cookieAccessToken = cookies?.accessToken

    if (!cookieAccessToken) return false

    const accessToken = this.tokenService.decryptToken(cookieAccessToken)

    if (!accessToken) return false

    const user = await this.tokenService.isAccessTokenValid(accessToken)

    if (!user) return false

    return user as IAccessTokenSignedPayload
  }

}
