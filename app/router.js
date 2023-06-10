const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uploader = require('./middleware/uploader')
const {
  ApplicationController,
  AuthenticationController,
  CourseController
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

  const courseController = new CourseController()

  const accessControl = authenticationController.accessControl

  app.get('/', applicationController.handleGetRoot)

  app.post('/register', authenticationController.handleRegister)
  app.post('/login', authenticationController.handleLogin)
  app.get('/logout', authenticationController.handleLogout)

  app.get('/user/list', authenticationController.handleListUser)
  app.put(
    '/user/update/:id',
    uploader.single('photoProfile'),
    authenticationController.handleUpdateUser
  )
  app.get('/user', authenticationController.handleGetUser)
  app.get('/user/:id', authenticationController.handleGetUserById)
  app.put("/user/update/:id", authenticationController.handleUpdateUser)

  // app.get('/onboarding', authenticationController.makeInstructor)
  app.post("/course/upload-image", courseController.uploadPreviewImage)
  app.post("/course/remove-image", courseController.removePreviewImage)

  return app
}

module.exports = { apply }
