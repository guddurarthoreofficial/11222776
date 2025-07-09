const { logEvent } = require("./logService");

/**
 * Reusable Logger
 * @param {string} token - JWT Access Token
 * @param {string} stack - "backend" | "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - See allowed list
 * @param {string} message - Log message
 */
const Logger = (token, stack, level, pkg, message) => {
  logEvent(token, stack.toLowerCase(), level.toLowerCase(), pkg.toLowerCase(), message);
};

module.exports = Logger;
