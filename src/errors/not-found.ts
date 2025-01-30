import ApplicationError from './application-error'

export default class NotFoundError extends ApplicationError {
  constructor(message: string = 'Not Found') {
    super(message, 404)
  }
}
