import { IncomingHttpHeaders } from "http"
import "express"
import { ObjectSchema } from "joi"

export interface ControllerArgs<T> {
  input?: T
  params?: T
  query?: T
  files?: any | null | undefined //TODO: come back to work on the types for this.
  user?: IAccessTokenSignedPayload | undefined | null
  headers?: IncomingHttpHeaders
  cookies?: any
}

export interface ValidationSchema {
  inputSchema?: ObjectSchema
  paramsSchema?: ObjectSchema
  querySchema?: ObjectSchema
}

export type Roles = "USER" | "ARTIST" | "ADMIN"

export interface ControllerHandlerOptions {
  isPrivate: boolean
  allowedRoles?: Roles[]
}

export interface IAccessTokenSignedPayload {
  id: string
  role: string
  refreshToken: string
}
