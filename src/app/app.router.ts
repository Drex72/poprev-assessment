import { Request, Router, Response } from "express"

import { HttpStatus, config } from "../core"
import { authRouter } from "../auth/router/auth.router"
import { userRouter } from "../user/router/user.router"
import { projectRouter } from "../project/project/router/project.router"

export const appRouter = Router()

appRouter.use("/auth", authRouter)
appRouter.use("/user", userRouter)
appRouter.use("/project", projectRouter)

appRouter.get("/health", (_: Request, res: Response) => {
  console.log(config)
  res.status(HttpStatus.OK).json({
    message: "App up",
    version: "1.0",
  })
})
