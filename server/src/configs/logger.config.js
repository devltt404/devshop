import path, { dirname } from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import { consoleFormat } from "winston-console-format";
import "winston-daily-rotate-file";
import serverConfig from "./server.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.prettyPrint(),
    winston.format.errors({ stack: true }),
    winston.format.printf((log) => {
      //If the log is an error, prints the stack trace
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ["timestamp", "service"],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        })
      ),
    }),
    new winston.transports.DailyRotateFile({
      level: "silly",
      filename: path.join(__dirname, `../logs/%DATE%-combined.log`),
      zippedArchive: true, // zip archived logs
      maxFiles: serverConfig.server.logFilesExpiration,
    }),
  ],
});

export default logger;
