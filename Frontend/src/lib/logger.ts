/**
 * lib/logger.ts — Frontend Application Logger
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('User logged in', { email: 'user@example.com', role: 'CANDIDATE' });
 *   logger.warn('Slow API response', { endpoint: '/api/daily-logs', ms: 800 });
 *   logger.error('Login failed', { email, error: err.message });
 *
 * In development : logs go to console with color-coded output.
 * In production  : logs are batched and sent to the /api/log endpoint
 *                  so they can be aggregated server-side.
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  page?: string;
  userEmail?: string;
}

const getPage = (): string => {
  if (typeof window === "undefined") return "SSR";
  return window.location.pathname;
};

const formatTimestamp = (): string => new Date().toISOString();

const levelColors: Record<LogLevel, string> = {
  DEBUG: "\x1b[36m", // Cyan
  INFO:  "\x1b[32m", // Green
  WARN:  "\x1b[33m", // Yellow
  ERROR: "\x1b[31m", // Red
};
const RESET = "\x1b[0m";

// Batch buffer for production log shipping
let logBuffer: LogEntry[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flushLogs = async () => {
  if (logBuffer.length === 0) return;
  const batch = [...logBuffer];
  logBuffer = [];
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs: batch }),
    });
  } catch {
    // Silently fail — don't cause infinite error loops
  }
};

const scheduleFlush = () => {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogs();
  }, 5000); // flush every 5 seconds
};

const log = (
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
) => {
  const entry: LogEntry = {
    level,
    message,
    timestamp: formatTimestamp(),
    page: getPage(),
    context,
  };

  if (process.env.NODE_ENV === "development") {
    const color = levelColors[level];
    const prefix = `${color}[${level}]${RESET} [${entry.timestamp}] [${entry.page}]`;
    if (context) {
      console.log(`${prefix} ${message}`, context);
    } else {
      console.log(`${prefix} ${message}`);
    }
    return;
  }

  // Production: buffer and ship to server
  if (level === "ERROR" || level === "WARN" || level === "INFO") {
    logBuffer.push(entry);
    scheduleFlush();
  }
};

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log("DEBUG", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log("INFO", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("WARN", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("ERROR", message, context),
};
