import dotenv from 'dotenv';
dotenv.config()

export const getEnvVariable = (key, defaultValue) => {
  const value = process.env[key];
  if (value === undefined || value === null) {
    if (defaultValue === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return defaultValue;
  }
  return value;
};
