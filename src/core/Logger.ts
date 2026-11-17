import { env } from "@config/env";

export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export class Logger {
  private static readonly currentLevel =
    LogLevel[env.logLevel as keyof typeof LogLevel];

  private static write(level: LogLevel, message: string): void {
    if (level < this.currentLevel) {
      return;
    }

    const timestamp = new Date().toISOString();

    const levelName = LogLevel[level];

    console.log(`[${timestamp}] [${levelName}] ${message}`);
  }

  static debug(message: string): void {
    this.write(LogLevel.DEBUG, message);
  }

  static info(message: string): void {
    this.write(LogLevel.INFO, message);
  }

  static warn(message: string): void {
    this.write(LogLevel.WARN, message);
  }

  static error(message: string): void {
    this.write(LogLevel.ERROR, message);
  }
}
