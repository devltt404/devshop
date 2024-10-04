import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import serverConfig from "./configs/server.config.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";

//------------------------------------------------------------------------------

const app = express();

// Cloudinary configuration
import "./cloudinary.js";

// Connect to database
import "../src/db/connect.db.js";
import logger from "./logger.js";

//middlewares
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      // Configure Morgan to use logger
      write: (message) => logger.http(message.trim()),
    },
  })
);
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: [serverConfig.client.baseUrl],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use(serverConfig.server.apiBasePath, apiRoutes);

//error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
