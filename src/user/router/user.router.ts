import { Router } from "express"
import { controllerHandler } from "../../core"
import { userService } from "../user.service"
import { transactProjectTokenSchema } from "./schema"

export const userRouter = Router()

userRouter
  .get("/wallet")
  .get(
    "/token-transactions",
    controllerHandler.handle(
      userService.getTokenTransactionsForUser,
      {},
      { isPrivate: true, allowedRoles: ["USER"] },
    ),
  )
  .post(
    "/buy-project-token",
    controllerHandler.handle(userService.buyToken, transactProjectTokenSchema, {
      isPrivate: true,
      allowedRoles: ["USER"],
    }),
  )
  .post(
    "/sell-project-token",
    controllerHandler.handle(
      userService.sellToken,
      transactProjectTokenSchema,
      { isPrivate: true, allowedRoles: ["USER"] },
    ),
  )
