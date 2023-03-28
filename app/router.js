const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uploader = require('./middleware/uploader')
const {
  ApplicationController,
  AuthenticationController,
} = require('./controllers')
const { User, Role } = require('./models')

function apply(app) {
  const userModel = User
  const roleModel = Role

  const applicationController = new ApplicationController()

  const authenticationController = new AuthenticationController({
    bcrypt,
    jwt,
    userModel,
    roleModel,
  })

  const accessControl = authenticationController.accessControl

  app.get('/', applicationController.handleGetRoot)

  app.post('/register', authenticationController.handleRegister)
  app.post('/login', authenticationController.handleLogin)

  app.get('/user/list', authenticationController.handleListUser)
  app.put(
    '/user/update/:id',
    uploader.single('photoProfile'),
    authenticationController.handleUpdateUser
  )

  return app
}

module.exports = { apply }
