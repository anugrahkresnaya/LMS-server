const snap = require('../lib/midtransConfig')

class TransactionsController {
  constructor({ orderModel, courseModel, userModel }){
    this.orderModel = orderModel
    this.courseModel = courseModel
    this.userModel = userModel
  }

  // midtrans payment
  handleCheckout = async (req, res) => {
    try {
      const { id } = req.params
      const { userId, instructorId, slug } = req.body
      const course = await this.courseModel.findByPk(id)

      const customer = await this.userModel.findByPk(userId)

      console.log('course data', course)

      if (!course) {
        res.status(404).json({ error: 'Course not found.' });
        return;
      }

      if(course.paid === false) {
        const order = await this.orderModel.create({
          courseId: course.id,
          transactionId: `ORDER-${course.id}-${Date.now()}`,
          amount: 0,
          userId,
          instructorId,
          slug,
          status: 'settlement'
        })
  
        res.status(201).json({
          status: "OK",
          message: "Order success",
          data: order
        })
      } else {
        // midtrans snap transaction
        let parameter = {
          "transaction_details": {
            "order_id": `ORDER-${course.id}-${Date.now()}`,
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
          successRedirectUrl: 'https://oceanz.vercel.app/payment',
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
          slug,
          token: transactionToken.token,
          redirectUrl: transactionToken.redirect_url
        })

        res.status(201).json({
          status: "OK",
          message: "Order success",
          data: order
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message
      })
    }
  }

  handleAfterPayment = async (req, res) => {
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

  handleOrderList = async (req, res) => {
    try {
      const order = await this.orderModel.findAll()
      
      res.status(200).json({
        status: "OK",
        message: "get order list success",
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

  getOrderByCourseId = async (req, res) => {
    try {
      const { courseId, userId, status } = req.body

      console.log('id', courseId)

      const order = await this.orderModel.findOne({
        where: {
          courseId,
          userId,
          status
        }
      })

      if (!order) {
        res.status(404).json({
          status: 'Fail',
          message: 'course id in order table not found'
        })
      } else {
        res.status(200).json({
          status: "OK",
          message: "Get order by course id success",
          data: order
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message
      })
    }
  }

  getOrderBySettlement = async (req, res) => {
    try {
      const { userId } = req.body

      const order = await this.orderModel.findAll({
        where: {
          userId,
          status: 'settlement'
        }
      })

      res.status(200).json({
        status: "OK",
        message: "get settlement in order success",
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
}

module.exports = TransactionsController