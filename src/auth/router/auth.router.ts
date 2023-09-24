import { Router } from "express"
import { loginSchema, signUpSchema } from "./schema"
import { controllerHandler } from "../../core"
import {
  login,
  signup,
  logout,
  roleService,
  refreshAccessToken,
  getAuthUser,
} from "../services"

export const authRouter = Router()

authRouter
  .get(
    "/user",
    controllerHandler.handle(getAuthUser.handle, {}, { isPrivate: true }),
  )
  .post("/login", controllerHandler.handle(login.handle, loginSchema))
  .post("/signup", controllerHandler.handle(signup.handle, signUpSchema))
  .post(
    "/logout",
    controllerHandler.handle(logout.handle, {}, { isPrivate: true }),
  )
  .get("/roles", controllerHandler.handle(roleService.findAll))
  .get("/refresh-token", controllerHandler.handle(refreshAccessToken.refresh))
