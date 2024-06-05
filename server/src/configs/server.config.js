import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"] }),

  SERVER_BASE_URL: str({ default: "http://localhost" }),
  SERVER_PORT: port({ default: 4000 }),
  API_BASE_PATH: str({ default: "/api/v1" }),

  JWT_SECRET: str(),
  ACCESS_TOKEN_EXPIRATION: str({ default: "30m" }),
  REFRESH_TOKEN_EXPIRATION: str({ default: "1d" }),

  DATABASE_URL: str(),

  CLIENT_BASE_URL: str(),
});

const serverConfig = {
  isDev: env.NODE_ENV === "development",
  isPro: env.NODE_ENV === "production",
  server: {
    port: env.SERVER_PORT,
    apiBasePath: env.API_BASE_PATH,
    jwtSecret: env.JWT_SECRET,
    accessTokenExpiration: env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: env.REFRESH_TOKEN_EXPIRATION,
  },
  database: {
    url: env.DATABASE_URL,
  },
  client: {
    baseUrl: env.CLIENT_BASE_URL,
  },
};

export default serverConfig;
