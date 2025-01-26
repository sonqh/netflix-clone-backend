import mongoose, { ConnectOptions } from 'mongoose'

/** Callback for establishing or re-establishing mongo connection */
type OnConnectedCallback = (mongoUrl: string) => void

interface SafeMongooseConnectionOptions {
  mongoUrl: string
  mongooseConnectionOptions?: ConnectOptions
  retryDelayMs?: number
  debugCallback?: (collectionName: string, method: string, query: Record<string, unknown>, doc: string) => void
  onStartConnection?: (mongoUrl: string) => void
  onConnectionError?: (error: Error, mongoUrl: string) => void
  onConnectionRetry?: (mongoUrl: string) => void
}

const defaultMongooseConnectionOptions: ConnectOptions = {
  autoCreate: true,
  autoIndex: true
}

/**
 * A Mongoose Connection wrapper class to
 * help with mongo connection issues.
 *
 * This library tries to auto-reconnect to
 * MongoDB without crashing the server.
 * @author Sidhant Panda
 * @modifiedBy SonQuach
 */
export default class SafeMongooseConnection {
  /** Safe Mongoose Connection options */
  private readonly options: SafeMongooseConnectionOptions

  /** Callback when mongo connection is established or re-established */
  private onConnectedCallback?: OnConnectedCallback

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false

  private shouldCloseConnection: boolean = false

  /** Delay between retrying connecting to Mongo */
  private retryDelayMs: number

  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectOptions

  private connectionTimeout?: NodeJS.Timeout

  /**
   * Start mongo connection
   * @param options SafeMongooseConnectionOptions
   */
  constructor(options: SafeMongooseConnectionOptions) {
    this.options = options
    this.retryDelayMs = options.retryDelayMs ?? 2000
    this.mongoConnectionOptions = options.mongooseConnectionOptions ?? defaultMongooseConnectionOptions

    mongoose.connection.on('error', this.onError)
    mongoose.connection.on('connected', this.onConnected)
    mongoose.connection.on('disconnected', this.onDisconnected)
    mongoose.connection.on('reconnected', this.onReconnected)

    if (options.debugCallback) {
      mongoose.set('debug', options.debugCallback)
    }
  }

  /** Close mongo connection */
  public async close(force: boolean = false): Promise<void> {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
    }
    this.shouldCloseConnection = true
    await mongoose.connection.close(force)
  }

  /** Start mongo connection */
  public connect(onConnectedCallback: OnConnectedCallback): void {
    this.onConnectedCallback = onConnectedCallback
    this.startConnection()
  }

  private startConnection = (): void => {
    this.options.onStartConnection?.(this.options.mongoUrl)
    mongoose.connect(this.options.mongoUrl, this.mongoConnectionOptions).catch(() => {})
  }

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = (): void => {
    this.isConnectedBefore = true
    this.onConnectedCallback?.(this.options.mongoUrl)
  }

  /** Handler called when mongo gets re-connected to the database */
  private onReconnected = (): void => {
    this.onConnectedCallback?.(this.options.mongoUrl)
  }

  /** Handler called for mongo connection errors */
  private onError = (): void => {
    const error = new Error(`Could not connect to MongoDB at ${this.options.mongoUrl}`)
    this.options.onConnectionError?.(error, this.options.mongoUrl)
  }

  /** Handler called when mongo connection is lost */
  private onDisconnected = (): void => {
    if (!this.isConnectedBefore && !this.shouldCloseConnection) {
      this.connectionTimeout = setTimeout(() => {
        this.startConnection()
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout)
        }
      }, this.retryDelayMs)
      this.options.onConnectionRetry?.(this.options.mongoUrl)
    }
  }
}
