import { IAccessTokenSignedPayload } from "../common"

declare global {
  namespace Express {
    export interface Request {
      user: IAccessTokenSignedPayload | null | undefined
    }
  }
}
