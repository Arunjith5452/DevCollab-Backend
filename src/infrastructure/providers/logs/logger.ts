import winston, { createLogger, format } from "winston";
import fs from "fs";
import path from "path";
import { LogLevel } from "@/domain/enums/logger/logger-level";

const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
  level: LogLevel.INFO,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: LogLevel.ERROR,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    new winston.transports.Console()
  ],
});
