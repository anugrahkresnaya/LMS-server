const snap = require('midtrans-client')

class TransactionsController {
  constructor({ orderModel, courseModel, userModel }){
    this.orderModel = orderModel
    this.courseModel = courseModel
    this.userModel = userModel
  }

  // midtrans payment
  handleCheckout = async (req, res) => {
    const { courseId, amount, userId, instructorId } = req.body

    try {
      const order = await this.orderModel.create({
        courseId,
        amount,
        userId,
        instructorId
      })
      res.status(201).json({
        status: "OK",
        message: "Order success",
        data: [order]
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message
      })
    }
  }
}

module.exports = TransactionsController