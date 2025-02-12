import { createLogger, format, transports } from 'winston'
import ConsoleLogTransport from './lib/winston-console-transport'
import dotenvConfig from './config/dotenv.config'
dotenvConfig.config()

const logTransports = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack
          }
        }
        return value
      }
    })
  }),
  new ConsoleLogTransport()
]

const logger = createLogger({
  format: format.combine(format.timestamp()),
  transports: logTransports,
  defaultMeta: { service: 'api' },
  level: process.env.NODE_ENV === 'development' ? 'silly' : 'info'
})

export default logger
