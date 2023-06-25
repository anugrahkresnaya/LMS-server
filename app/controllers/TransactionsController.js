const snap = require('../lib/midtransConfig')

class TransactionsController {
  constructor({ orderModel, courseModel, userModel }){
    this.orderModel = orderModel
    this.courseModel = courseModel
    this.userModel = userModel
  }

  // midtrans payment
  handleCheckout = async (req, res) => {
    // const { courseId, amount, userId, instructorId } = req.body

    try {
      const { id } = req.params
      const { userId, instructorId } = req.body
      const course = await this.courseModel.findByPk(id)

      const customer = await this.userModel.findByPk(userId)

      console.log('course data', course)

      if (!course) {
        res.status(404).json({ error: 'Course not found.' });
        return;
      }

      // midtrans snap transaction
      let parameter = {
        "transaction_details": {
          "order_id": `ORDER-${course.slug}-${Date.now()}`,
          "gross_amount": course.price
        }, "credit_card":{
          "secure" : true
        }, "customer_details": {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email
        }
      }

      const transactionOptions = {
        // Set callback URLs for success, failure, and pending payments
        successRedirectUrl: 'https://b0b6-101-128-127-159.ngrok-free.app/payment',
        // failureRedirectUrl: 'http://your-website.com/failure',
        // pendingRedirectUrl: 'http://your-website.com/pending',
      } 

      const transactionToken = await snap.createTransaction(parameter, transactionOptions)

      console.log('transaction', transactionToken)

      const order = await this.orderModel.create({
        courseId: course.id,
        transactionId: parameter.transaction_details.order_id,
        amount: parameter.transaction_details.gross_amount,
        userId,
        instructorId,
        token: transactionToken.token,
        redirectUrl: transactionToken.redirect_url
      })

      res.status(201).json({
        status: "OK",
        message: "Order success",
        data: order
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message
      })
    }
  }

  handleAfterPayment = async (req, res) => {
    // const order_id = req.query.order_id
    // const transaction_status = req.query.transaction_status

    const { order_id, transaction_status } = req.body

    try {
      const order = await this.orderModel.findOne({
        where: {
          transactionId: order_id
        }
      })

      if (!order) {
        res.status(404).json({ error: 'Order not found.' });
        return;
      }

      // Update the order status based on the transaction status
      if (transaction_status === 'settlement') {
        order.status = 'settlement';
        await order.save();
      } else if (transaction_status === 'pending') {
        order.status = 'pending';
        await order.save();
      } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
        order.status = 'failed';
        await order.save();
      }

      res.sendStatus(200);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message
      })
    }
  }

  // getOrderByOrderId = async (req, res) => {
  //   try {
  //     const { order_id } = req.body

  //     console.log(order_id)

  //     const order = await this.orderModel.findOne({
  //       where: {
  //         transactionId: order_id
  //       }
  //     })

  //     res.status(200).json({
  //       status: "OK",
  //       message: "Get order by id success",
  //       data: order
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).json({
  //       status: 'Fail',
  //       message: error.message
  //     })
  //   }
  // }
}

module.exports = TransactionsController