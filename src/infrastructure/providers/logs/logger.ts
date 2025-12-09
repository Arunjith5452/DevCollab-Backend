import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";
import cron from "node-cron";

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



const attentionDays = 14

function cleanOldLogs() {
  const logFiles = ["error.log", "combined.log"];

  for (const file of logFiles) {
    const filePath = path.join(logDir, file);
    if (!fs.existsSync(filePath)) continue;

    const data = fs.readFileSync(filePath, "utf-8").split("\n");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - attentionDays);

    const recentLogs = data.filter((line) => {
      const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
      if (!match) return true;
      const logDate = new Date(match[1]);
      return logDate >= cutoffDate;
    });

    fs.writeFileSync(filePath, recentLogs.join("\n"), "utf-8");
    console.log(`🧹 Cleaned old logs in ${file} — kept only last ${attentionDays} days.`);
  }
}

// Run cleanup automatically every day at midnight
cron.schedule("0 0 * * *", cleanOldLogs);

// Optionally run cleanup once on startup
cleanOldLogs();
