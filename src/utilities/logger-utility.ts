import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import axios from "axios";
import chalk from "chalk";

// RFC 5424 Syslog Levels
const syslogLevels = {
  emerg: 0, // System is unusable
  alert: 1, // Immediate action required
  crit: 2, // Critical conditions
  error: 3, // Error conditions
  warn: 4, // Warning conditions
  notice: 5, // Normal but significant
  info: 6, // Informational messages
  debug: 7, // Debug-level messages
};

const logColors: Record<string, chalk.Chalk> = {
  emerg: chalk.bgRed.white.bold,
  alert: chalk.red.bold,
  crit: chalk.magenta.bold,
  error: chalk.red,
  warn: chalk.yellow,
  notice: chalk.blue,
  info: chalk.green,
  debug: chalk.gray,
};

const logDir = path.join(__dirname, "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const fileTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  levels: syslogLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }),
  ),
  transports: [fileTransport],
});

Object.keys(syslogLevels).forEach((level) => {
  logger.add(
    new winston.transports.Console({
      format: winston.format.printf(({ level, message, timestamp }) => {
        const coloredLevel = logColors[level](level.toUpperCase());
        return `[${chalk.gray(timestamp)}] [${coloredLevel}] ${message}`;
      }),
    }),
  );
});

const API_ENDPOINT = "https://timestamp.fun/api/booth/log";
const sendLogToAPI = async (level: string, message: string) => {
  try {
    await axios.post(
      API_ENDPOINT,
      {
        level,
        message,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          token: process.env.BOOTH_ID,
        },
      },
    );
  } catch (error) {
    console.error("Failed to send log to API:", error);
  }
};

const logWrapper = (
  level: keyof typeof syslogLevels,
  message: unknown,
  ...args: unknown[]
) => {
  const msg = [
    message,
    ...args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg) : String(arg),
    ),
  ].join(" ");
  logger.log(level, msg);
  //sendLogToAPI(level, msg);
};

export const Logger = {
  debug: (msg: string) => logWrapper("debug", msg),
  info: (msg: string) => logWrapper("info", msg),
  warn: (msg: string) => logWrapper("warn", msg),
  error: (msg: string) => logWrapper("error", msg),
  emerg: (msg: string) => logWrapper("emerg", msg),
};
