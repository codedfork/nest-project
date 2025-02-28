import * as winston from "winston";

// Define the log format
const logFormat = winston.format.combine(
  winston.format.colorize(), // Colorize logs in the console
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`; // Custom log format
  })
);

// Configure the logger with different log levels and transports
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/app.log' }) // Log to a file
  ]
});

export default logger;
