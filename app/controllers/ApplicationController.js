const { NotFoundError } = require('../errors')

class ApplicationController {
  handleGetRoot = (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'LMS API is running',
    })
  }

  handleNotFound = (req, res) => {
    const err = new NotFoundError(req.method, req.url)

    res.status(404).json({
      error: {
        name: err.name,
        message: err.message,
        details: err.details,
      },
    })
  }
}

module.exports = ApplicationController
