import { Router } from "express"
import { userService } from "../user.service"
import { transactProjectTokenSchema } from "./schema"
import { ControlBuilder } from "../../core/middlewares/controlBuilder"

export const userRouter = Router()

userRouter
  .get(
    "/wallet",
    ControlBuilder.builder()
      .setHandler(userService.getUserWallet)
      .isPrivate()
      .only("USER")
      .handle(),
  )

  .get(
    "/token-transactions",
    ControlBuilder.builder()
      .setHandler(userService.getTokenTransactionsForUser)
      .isPrivate()
      .only("USER")
      .handle(),
  )
  .post(
    "/buy-project-token",
    ControlBuilder.builder()
      .setHandler(userService.buyToken)
      .isPrivate()
      .only("USER")
      .setValidator(transactProjectTokenSchema)
      .handle(),
  )

  .post(
    "/sell-project-token",
    ControlBuilder.builder()
      .setHandler(userService.sellToken)
      .isPrivate()
      .only("USER")
      .setValidator(transactProjectTokenSchema)
      .handle(),
  )
