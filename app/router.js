const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const upload = require('./middleware/upload')
const {
  ApplicationController,
  AuthenticationController,
  CourseController,
  TransactionsController,
  CommentController,
  RatingController
} = require('./controllers')
const { 
  User,
  Role,
  Course,
  Order,
  Comment,
  Rating
} = require('./models')

function apply(app) {
  const userModel = User
  const roleModel = Role
  const courseModel = Course
  const orderModel = Order
  const commentModel = Comment
  const ratingModel = Rating

  const applicationController = new ApplicationController()

  const authenticationController = new AuthenticationController({
    bcrypt,
    jwt,
    userModel,
    roleModel,
  })

  const courseController = new CourseController({ courseModel, userModel })
  const transactionController = new TransactionsController({
    orderModel,
    courseModel,
    userModel
  })
  const commentController = new CommentController({
    courseModel,
    commentModel,
    userModel
  })
  const ratingController = new RatingController({
    ratingModel,
    courseModel,
    userModel
  })

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
  app.delete('/user/delete/:id', authenticationController.authorize(accessControl.ADMIN), authenticationController.handleDeleteUser)

  app.post('/course/:id/create-course', upload.any(), authenticationController.authorize(), courseController.createCourse)
  app.get('/course/id/:id', courseController.getCourseById)
  app.get('/course/:slug', courseController.getCourseBySlug)
  app.put('/course/update/:slug', upload.any(), courseController.handleUpdateCourse)
  app.get('/courses', courseController.getCourseList)
  app.post('/courses/list/byId', courseController.getCourseListById)
  app.get('/courses/:instructorId', authenticationController.authorize(), courseController.getCourseListByInstructorId)
  app.delete('/course/delete/:id', authenticationController.authorize(), courseController.handleDeleteCourse)
  app.get('/searchCourses', courseController.handleSearchCourse)

  // app.get('/check', transactionController.handleCheckout)
  app.post('/course/:id/order', transactionController.handleCheckout)
  // app.post('/courseFree/:id/order', transactionController.handleCheckoutFree)
  app.post('/payment/updateStatus', transactionController.handleAfterPayment)
  app.post('/access', transactionController.getOrderByCourseId)
  app.post('/getCourseBySettlement', transactionController.getOrderBySettlement)
  // app.get('/orderId', transactionController.getOrderByOrderId)
  app.get('/orders', transactionController.handleOrderList)

  app.post('/comment/:courseSlug', commentController.handleCreateComment)
  app.get('/comments/:courseSlug', commentController.handleGetComments)
  app.delete('/comment/:id', commentController.handleDeleteComment)

  app.post(
    '/rating/:courseSlug',
    authenticationController.authorize(accessControl.USER),
    ratingController.handleCreateRating
  )
  app.get('/ratings', ratingController.handleGetRatingList)
  app.get(
    '/ratingsBySlug/:courseSlug',
    ratingController.handleGetRatingByCourseSlug
  )

  return app
}

module.exports = { apply }
