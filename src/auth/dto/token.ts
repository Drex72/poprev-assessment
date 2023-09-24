import { Users } from "../models"

export interface ITokenService {
  createAndEncryptAccessToken(payload: IAccessTokenSignedPayload): string
  createAndEncryptRefreshToken(payload: IRefreshTokenSignedPayload): string
  isAccessTokenValid(
    token: string,
  ): Promise<boolean | IAccessTokenSignedPayload>
  isRefreshTokenValid(token: string): Promise<false | Users>
  decryptToken(token: string): string | undefined
}

export interface IAccessTokenSignedPayload {
  id: string
  role: string
  refreshToken: string
}
export interface IRefreshTokenSignedPayload {
  id: string
}
