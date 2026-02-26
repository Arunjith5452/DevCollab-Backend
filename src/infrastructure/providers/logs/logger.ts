import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
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
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      level: LogLevel.ERROR,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
    }),

    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});
