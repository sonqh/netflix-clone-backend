export default class ApplicationError extends Error {
  public status: number

  constructor(message: string = 'ApplicationError', status: number = 500) {
    super(message)
    this.status = status
    this.name = this.constructor.name
  }
}
