import { createServer } from "http";
import { config, logger } from "../core";
import { app } from "./app.service";

export const startApp = async () => {
  const server = createServer(app);
  server.listen(config.port, () => {
    logger.info(`Server started successfully on port ${config.port}`)
  });
};
