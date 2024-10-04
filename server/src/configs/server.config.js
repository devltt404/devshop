import dotenv from "dotenv";
dotenv.config();

import { cleanEnv, port, str } from "envalid";
import { NODE_ENV } from "../constants/index.js";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: Object.values(NODE_ENV),
    default: NODE_ENV.development,
  }),

  SERVER_BASE_URL: str({ default: "http://localhost" }),
  SERVER_PORT: port({ default: 4000 }),
  API_BASE_PATH: str({ default: "/api/v1" }),

  JWT_SECRET: str(),
  ACCESS_TOKEN_EXPIRATION: str({ default: "1h" }),
  REFRESH_TOKEN_EXPIRATION: str({ default: "60d" }),

  STRIPE_PK: str(),
  STRIPE_SK: str(),

  CLOUDINARY_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),

  DATABASE_URL: str(),

  LOG_FILES_EXPIRATION: str({ default: "3d" }),

  CLIENT_BASE_URL: str(),
});

const serverConfig = {
  isDev: env.NODE_ENV === NODE_ENV.development,
  isPro: env.NODE_ENV === NODE_ENV.production,
  server: {
    port: env.SERVER_PORT,
    apiBasePath: env.API_BASE_PATH,
    apiBaseUrl: `${env.SERVER_BASE_URL}:${env.SERVER_PORT}${env.API_BASE_PATH}`,
    jwtSecret: env.JWT_SECRET,
    accessTokenExpiration: env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: env.REFRESH_TOKEN_EXPIRATION,
    logFilesExpiration: env.LOG_FILES_EXPIRATION,
  },
  database: {
    url: env.DATABASE_URL,
  },
  client: {
    baseUrl: env.CLIENT_BASE_URL,
  },
  stripe: {
    pk: env.STRIPE_PK,
    sk: env.STRIPE_SK,
  },
  cloudinary: {
    name: env.CLOUDINARY_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
};

export default serverConfig;
