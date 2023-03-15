const httpStatus = require('http-status')
const { JWT_SIGNATURE_KEY } = require('../../config/application')
const ApiError = require('../errors/ApiError')
const EmailAlreadyTakenError = require('../errors/EmailAlreadyTakenError')
const EmailNotRegisteredError = require('../errors/EmailNotRegisteredError')
const ApplicationController = require('./ApplicationController')

class AuthenticationController extends ApplicationController {
  constructor({ userModel, roleModel, bcrypt, jwt }) {
    super()
    this.userModel = userModel
    this.roleModel = roleModel
    this.bcrypt = bcrypt
    this.jwt = jwt
  }

  accessControl = {
    ADMIN: 'ADMIN',
    USER: 'USER',
  }

  // authorize = (rolename) => {
  //   return (req, res, next) => {
  //     try {
  //       const token = req.headers.authorization?.split()
  //     }
  //   }
  // }

  handleLogin = async (req, res) => {
    try {
      const email = req.body.email.toLowerCase()
      const password = req.body.password
      const user = await this.userModel.findOne({
        where: { email },
        include: [{ model: this.roleModel, attributes: ['id', 'name'] }],
      })

      if (!user) {
        const err = new EmailNotRegisteredError(email)
        res.status(404).json(err)
        return
      }

      const isPasswordCorrect = this.verifyPassword(
        password,
        user.encryptedPassword
      )

      if (!isPasswordCorrect) {
        res.status(401).json(new Error())
        return
      }

      const accessToken = this.createTokenFromUser(user, user.Role)

      res.status(200).json({
        status: 'OK',
        message: 'Login Successful',
        id: user.id,
        user: user.email,
        accessToken,
      })
    } catch (err) {
      res.status(400).json({
        status: 'FAIL',
        message: err.message,
      })
    }
  }

  handleRegister = async (req, res) => {
    const name = req.body.name
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    let existingUser = await this.userModel.findOne({ where: { email } })

    if (!!existingUser) {
      const err = new EmailAlreadyTakenError(email)
      res.status(422).json(err)
      return
    }

    if (!email) {
      const err = new ApiError(httpStatus.BAD_REQUEST, 'email cannot be empty')
      res.status(422).json(err)
      return
    }

    if (!password) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        'password cannot be empty'
      )
      res.status(422).json(err)
      return
    }

    const passwordLength = password.length >= 6
    if (!passwordLength) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        'password at least have 6 characters or more'
      )
      res.status(422).json(err)
    }

    const role = await this.roleModel.findOne({
      where: {
        name: this.accessControl.USER,
      },
    })

    const user = await this.userModel.create({
      name,
      email,
      encryptedPassword: this.encryptPassword(password),
      roleId: role.id,
    })

    const accessToken = this.createTokenFromUser(user, role)

    res.status(201).json({
      status: 'OK',
      message: 'Success Register New User',
      user: user.email,
      accessToken,
    })
  }

  createTokenFromUser = (user, role) => {
    return this.jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: {
          id: role.id,
          name: role.name,
        },
      },
      JWT_SIGNATURE_KEY
    )
  }

  encryptPassword = (password) => {
    return this.bcrypt.hashSync(password, 10)
  }

  verifyPassword = (password, encryptedPassword) => {
    return this.bcrypt.compareSync(password, encryptedPassword)
  }
}

module.exports = AuthenticationController
