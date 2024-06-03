import { getEnvVariable } from "../utils/env.util.js";

const serverConfig = {
  env: getEnvVariable("NODE_ENV"),
  server: {
    baseUrl: getEnvVariable("SERVER_BASE_URL", "http://localhost"),
    port: getEnvVariable("SERVER_PORT"),
    apiBaseUrl: getEnvVariable("API_BASE_URL", "/api/v1"),
    jwtSecret: getEnvVariable("JWT_SECRET"),
    accessTokenExpiration: getEnvVariable("ACCESS_TOKEN_EXPIRATION", "30m"),
    refreshTokenExpiration: getEnvVariable("REFRESH_TOKEN_EXPIRATION", "1d"),
  },
  database: {
    url: getEnvVariable("DATABASE_URL"),
  },
  client: {
    baseUrl: getEnvVariable("CLIENT_BASE_URL"),
  }
};

export default serverConfig;
