const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const upload = require('./middleware/upload')
const {
  ApplicationController,
  AuthenticationController,
  CourseController
} = require('./controllers')
const { User, Role, Course } = require('./models')

function apply(app) {
  const userModel = User
  const roleModel = Role
  const courseModel = Course

  const applicationController = new ApplicationController()

  const authenticationController = new AuthenticationController({
    bcrypt,
    jwt,
    userModel,
    roleModel,
  })

  const courseController = new CourseController({ courseModel })

  const accessControl = authenticationController.accessControl

  app.get('/', applicationController.handleGetRoot)

  app.post('/register', authenticationController.handleRegister)
  app.post('/login', authenticationController.handleLogin)
  app.get('/logout', authenticationController.handleLogout)

  app.get('/user/list', authenticationController.handleListUser)
  app.put(
    '/user/update/:id',
    upload.single('photoProfile'),
    authenticationController.handleUpdateUser
  )
  app.get('/user', authenticationController.handleGetUser)
  app.get('/user/:id', authenticationController.handleGetUserById)
  app.put("/user/update/:id", authenticationController.handleUpdateUser)

  // app.get('/onboarding', authenticationController.makeInstructor)
  app.post('/course/create-course', upload.any(), courseController.createCourse)
  app.get('/course/:id', courseController.getCourseById)

  return app
}

module.exports = { apply }
