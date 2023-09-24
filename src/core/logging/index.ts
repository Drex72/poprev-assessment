import { Logger } from "winston";
import { config, prodDevLogger,buildDevLogger } from "../config";


export const logger: Logger = 
    config.appEnvironment === "production" 
    ? prodDevLogger()
    : buildDevLogger();