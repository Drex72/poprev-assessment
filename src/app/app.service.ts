import express from "express";

import {
  notFoundHandler,
  errorHandler,
  globalRateLimiter,
} from "../core";
import { appRouter } from "./app.router";
import cookieParser from "cookie-parser"


export const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(globalRateLimiter);
app.use("/api/v1", appRouter);
app.use(notFoundHandler.handle);
app.use(errorHandler.handle);
