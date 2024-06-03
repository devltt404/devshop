import app from "./src/app.js";
import serverConfig from "./src/configs/server.config.js";

const server = app.listen(serverConfig.server.port, () => {
  console.log(`Server is running on port ${serverConfig.server.port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
