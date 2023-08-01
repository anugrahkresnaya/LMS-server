const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body } = require('express-validator')
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
  app.post(
    '/forgot-password',
    [body('email').isEmail().withMessage('Invalid Email')],
    authenticationController.handleForgotPassword
  )
  app.post(
    '/reset-password/:token',
    [body('password').isLength({ min: 6 }).withMessage('password at least have 6 characters or more')],
    authenticationController.handleResetPassword
  )

  app.get('/user/list', authenticationController.handleListUser)
  app.put(
    '/user/update/:id',
    upload.single('photoProfile'),
    authenticationController.handleUpdateUser
  )
  app.get('/user', authenticationController.handleGetUser)
  app.get('/user/:id', authenticationController.handleGetUserById)
  app.put(
    "/user/update/:id",
    authenticationController.authorize(),
    authenticationController.handleUpdateUser
  )
  app.delete(
    '/user/delete/:id',
    authenticationController.authorize(accessControl.ADMIN),
    authenticationController.handleDeleteUser
  )

  app.post(
    '/course/:id/create-course',
    upload.any(),
    authenticationController.authorize(),
    courseController.createCourse
  )
  app.get('/course/id/:id', courseController.getCourseById)
  app.get('/course/:slug', courseController.getCourseBySlug)
  app.put(
    '/course/update/:slug',
    upload.any(),
    authenticationController.authorize(),
    courseController.handleUpdateCourse
  )
  app.get('/courses', courseController.getCourseList)
  app.post('/courses/list/byId', courseController.getCourseListById)
  app.get(
    '/courses/:instructorId',
    authenticationController.authorize(),
    courseController.getCourseListByInstructorId
  )
  app.delete(
    '/course/delete/:id',
    authenticationController.authorize(),
    courseController.handleDeleteCourse
  )
  app.get('/searchCourses', courseController.handleSearchCourse)

  app.post(
    '/course/:id/order',
    authenticationController.authorize(accessControl.USER),
    transactionController.handleCheckout
  )
  app.post('/payment/updateStatus', transactionController.handleAfterPayment)
  app.post('/access', transactionController.getOrderByCourseId)
  app.post('/getCourseBySettlement', transactionController.getOrderBySettlement)
  app.get('/orders', transactionController.handleOrderList)
  app.delete(
    '/order/delete/:id',
    authenticationController.authorize(accessControl.ADMIN),
    transactionController.handleDeleteOrder
  )

  app.post(
    '/comment/:courseSlug',
    authenticationController.authorize(),
    commentController.handleCreateComment
  )
  app.get('/comments/:courseSlug', commentController.handleGetComments)
  app.get('/commentList', commentController.handleGetCommentList)
  app.delete(
    '/comment/delete/:id',
    authenticationController.authorize(),
    commentController.handleDeleteComment
  )

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
  app.delete(
    '/rating/delete/:id',
    authenticationController.authorize(accessControl.ADMIN),
    ratingController.handleDeleteRating
  )

  return app
}

module.exports = { apply }
