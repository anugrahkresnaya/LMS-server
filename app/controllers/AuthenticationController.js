const httpStatus = require('http-status')
const { JWT_SIGNATURE_KEY } = require('../../config/application')
const ApiError = require('../errors/ApiError')
const EmailAlreadyTakenError = require('../errors/EmailAlreadyTakenError')
const EmailNotRegisteredError = require('../errors/EmailNotRegisteredError')
const ApplicationController = require('./ApplicationController')
const { NotFoundError } = require('../errors')
const imageKit = require('../lib/imageKitConfig')
const snap = require('../lib/midtransConfig')

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

  authorize = (rolename) => {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        const payload = this.decodeToken(token)

        if (!!rolename && rolename != payload.role.name)
          throw new InsufficientAccessError(payload?.role?.name);
        req.user = payload;
        next();
      }

      catch (err) {
        res.status(401).json({
          error: {
            name: err.name,
            message: err.message,
            details: err.details || null,
          }
        })
      }
    }
  }

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

      console.log('accessToken nih: ', accessToken)

      res.cookie("token", accessToken, {
        httpOnly: true,
        // secure: true, // only works on https
      })

      res.status(200).json({
        status: 'OK',
        message: 'Login Successful',
        id: user.id,
        user: user.email,
        role: user.roleId,
        photoProfile: user?.photoProfile,
        accessToken,
      })
    } catch (err) {
      res.status(400).json({
        status: 'FAIL',
        message: err.message,
      })
    }
  }

  handleLogout = async (req, res) => {
    try {
      res.clearCookie("token")
      res.status(200).json({ message: "signout success" })
    } catch (error) {
      res.status(400).json({
        status: 'FAIL',
        message: error.message,
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

  handleUpdateUser = async (req, res) => {
    try {
      const { firstName, lastName, gender, dateOfBirth, phoneNumber, photoProfile } = req.body

      const user = await this.getUserFromRequest(req)

      if (req.file != null) {
        const imageName = req.file.originalname
        //upload file
        const img = await imageKit.upload({
          file: req.file.buffer,
          fileName: imageName,
        })

        await user.update({
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          photoProfile: img.url,
        })

        res.status(200).json({
          status: 'success',
          message: 'user updated successfully',
          data: {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            phoneNumber,
            photoProfile: img.url,
          },
        })
      } else {
        await user.update({
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          photoProfile,
        })

        res.status(200).json({
          status: 'success',
          message: 'user updated successfully',
          data: {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            phoneNumber,
            photoProfile,
          },
        })
      }
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        },
      })
    }
  }

  handleGetUser = async (req, res) => {
    const user = await this.userModel.findByPk(req.user.id)

    if (!user) {
      const err = new NotFoundError(req.user.name)
      res.status(404).json(err)
      return
    }

    const role = await this.roleModel.findByPk(user.roleId)

    if (!role) {
      const err = new NotFoundError(req.user.name)
      res.status(404).json(err)
      return
    }

    res.status(200).json({
      status: 'success',
      message: 'get user data successful',
      data: user,
    })
  }

  handleGetUserById = async (req, res) => {
    try {
      const user = await this.getUserFromRequest(req)

      res.status(200).json({
        status: 'success',
        message: 'get user by id successful',
        data: [user],
      })
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        },
      })
    }
  }

  handleListUser = async (req, res) => {
    const users = await this.userModel.findAll()

    res.status(200).json({
      status: 'success',
      message: 'get users list successfull',
      data: users,
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
      JWT_SIGNATURE_KEY,
      {
        expiresIn: "7d",
      }
    )
  }

  handleDeleteUser = async (req, res) => {
    try {
      const user = await this.getUserFromRequest(req)
      await user.destroy()

      res.status(200).json({
        status: "OK",
        message: "User has been deleted"
      })
    } catch (error) {
      console.log(error)
      res.status(404).json({
        status: "Fail",
        message: error.message,
      })
    }
  }

  encryptPassword = (password) => {
    return this.bcrypt.hashSync(password, 10)
  }

  verifyPassword = (password, encryptedPassword) => {
    return this.bcrypt.compareSync(password, encryptedPassword)
  }

  getUserFromRequest(req) {
    return this.userModel.findByPk(req.params.id)
  }

  decodeToken(token) {
    return this.jwt.verify(token, JWT_SIGNATURE_KEY);
  }
}

module.exports = AuthenticationController
