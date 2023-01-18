import pico from 'picocolors'

interface Logger {
  info(message: string): void
  success(message: string): void
  warn(message: string): void
  error(message: string): void
}

export default function createLogger(): Logger {
  const logger: Logger = {
    info(message) {
      console.log(message)
    },
    success(message) {
      console.warn(pico.green(message))
    },
    warn(message) {
      console.warn(pico.yellow(message))
    },
    error(message) {
      console.error(pico.red(message))
    },
  }
  return logger
}
