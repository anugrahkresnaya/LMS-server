const express = require('express')
const router = require('./router')
const cors = require('cors')
const { MORGAN_FORMAT } = require('../config/application')
const morgan = require('morgan')

const app = express()

const corsOptions = {
  origin: true,
  credentials: true
}

app.use(morgan(MORGAN_FORMAT))
app.use(cors(corsOptions))
app.use(express.json({ limit: "5mb" })) 

module.exports = router.apply(app)
