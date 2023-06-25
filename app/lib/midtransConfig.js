const midtransClient = require('midtrans-client')

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY_SB,
  clientKey: process.env.MIDTRANS_CLIENT_KEY_SB
})

module.exports = snap