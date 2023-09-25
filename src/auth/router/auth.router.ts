import { Router } from "express"
import { loginSchema, signUpSchema } from "./schema"
import {
  login,
  signup,
  logout,
  roleService,
  refreshAccessToken,
  getAuthUser,
} from "../services"
import { ControlBuilder } from "../../core/middlewares/controlBuilder"

export const authRouter = Router()

authRouter
  .get(
    "/user",
    ControlBuilder.builder()
      .setHandler(getAuthUser.handle)
      .isPrivate()
      .handle(),
  )
  .post(
    "/login",
    ControlBuilder.builder()
      .setHandler(login.handle)
      .setValidator(loginSchema)
      .handle(),
  )

  .post(
    "/signup",
    ControlBuilder.builder()
      .setHandler(signup.handle)
      .setValidator(signUpSchema)
      .handle(),
  )
  .post(
    "/logout",
    ControlBuilder.builder()
      .setHandler(logout.handle)
      .isPrivate()

      .handle(),
  )

  .get(
    "/roles",
    ControlBuilder.builder().setHandler(roleService.findAll).handle(),
  )

  .get(
    "/refresh-token",
    ControlBuilder.builder().setHandler(refreshAccessToken.refresh).handle(),
  )
