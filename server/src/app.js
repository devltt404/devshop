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

// Connect to database
import "../src/db/connect.db.js";

//middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use(cors({ origin: serverConfig.client.baseUrl, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use(serverConfig.server.apiBaseUrl, apiRoutes);

//error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
