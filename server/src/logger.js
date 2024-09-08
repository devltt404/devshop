import path, { dirname } from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import "winston-daily-rotate-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.prettyPrint(),
    winston.format.printf((log) => {
      //If the log is an error, prints the stack trace
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: "silly",
    }),
    new winston.transports.DailyRotateFile({
      level: "silly",
      filename: path.join(__dirname, `/logs/%DATE%-combined.log`),
      zippedArchive: true, // zip archived logs
      maxFiles: "3d", // keep logs for 3 days to save space
    }),
  ],
});

export default logger;
