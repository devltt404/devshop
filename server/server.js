import app from "./src/app.js";
import serverConfig from "./src/configs/server.config.js";
import logger from "./src/logger.js";

const server = app.listen(serverConfig.server.port, () => {
  logger.info(`Server is running on port ${serverConfig.server.port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    logger.warn("Server closed");
  });
});
