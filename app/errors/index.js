const ApiError = require('./ApiError')
const EmailNotRegisteredError = require('./EmailNotRegisteredError')
const NotFoundError = require('./NotFoundError')
const EmailAlreadyTakenError = require('./EmailAlreadyTakenError')

module.exports = {
  ApiError,
  EmailNotRegisteredError,
  NotFoundError,
  EmailAlreadyTakenError,
}
