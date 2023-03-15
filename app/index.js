const express = require('express')
const router = require('./router')
const cors = require('cors')
const { MORGAN_FORMAT } = require('../config/application')
const morgan = require('morgan')

const app = express()

app.use(morgan(MORGAN_FORMAT))
app.use(cors())
app.use(express.json())

module.exports = router.apply(app)
