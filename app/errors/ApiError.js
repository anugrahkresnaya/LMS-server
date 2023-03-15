const ApplicationError = require('./ApplicationError')

class ApiError extends ApplicationError {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }

  get details() {
    return {
      statusCode: this.statusCode,
    }
  }
}

module.exports = ApiError
