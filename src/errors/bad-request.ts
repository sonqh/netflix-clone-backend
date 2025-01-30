import ApplicationError from './application-error'

export default class BadRequest extends ApplicationError {
  constructor(message: string = 'Bad request') {
    super(message, 400)
  }
}
