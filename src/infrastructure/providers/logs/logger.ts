import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
  transports: [
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
});
