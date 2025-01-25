import Transport from 'winston-transport'
import { LogEntry } from 'winston'
import { format } from 'date-fns'

/**
 * https://stackoverflow.com/a/41407246
 * Log level escape codes
 */
const levelStyleMap: Record<string, string> = {
  error: '\x1b[41m%s\x1b[0m',
  warn: '\x1b[33m%s\x1b[0m',
  info: '\x1b[94m%s\x1b[0m',
  verbose: '\x1b[35m%s\x1b[0m',
  debug: '\x1b[32m%s\x1b[0m',
  silly: '\x1b[36m%s\x1b[0m'
}

export default class ConsoleLogTransport extends Transport {
  log(info: LogEntry, callback: () => void): void {
    const label = info.consoleLoggerOptions?.label ?? info.level.toUpperCase()
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const finalMessage = `[${timestamp}] [${label}] ${info.message}`

    console.log(levelStyleMap[info.level] || '%s', finalMessage)

    if (info.stack) {
      console.log('\t', info.stack)
    }

    callback()
  }
}
