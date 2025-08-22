function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (msg, ...args) => {
    console.log(`[${timestamp()}] [info] ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`[${timestamp()}] [warn] ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`[${timestamp()}] [error] ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${timestamp()}] [debug] ${msg}`, ...args);
    }
  },
};
