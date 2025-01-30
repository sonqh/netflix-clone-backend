import ApplicationError from './application-error'

export default class InternalServerError extends ApplicationError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500)
  }
}
