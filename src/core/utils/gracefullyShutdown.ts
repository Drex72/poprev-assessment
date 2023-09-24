import { logger } from "../logging";

export const gracefullyShutdown = async (error: unknown) => {
    logger.error("UNEXPECTED_APP_ERROR", error);
    process.exit(1);
}