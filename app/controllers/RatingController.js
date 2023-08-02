class RatingController {
  constructor({ ratingModel, userModel, courseModel }) {
    this.ratingModel = ratingModel
    this.userModel = userModel
    this.courseModel = courseModel
  }

  handleCreateRating = async (req, res) => {
    try {
      const { courseSlug } = req.params
      const {
        userId,
        value,
        review
      } = req.body

      const user = await this.userModel.findByPk(userId)

      if(!user) {
        res.status(404).json({
          status: "Fail",
          message: "User not found or not login"
        })
      }

      const rating = await this.ratingModel.create({
        userData: {user},
        value,
        review,
        courseSlug
      })

      res.status(201).json({
        status: "OK",
        message: "Rating successfully created",
        data: [rating]
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: "Fail",
        message: error.message
      })
    }
  }

  handleGetRatingByCourseSlug = async (req, res) => {
    try {
      const { courseSlug } = req.params

      const ratings = await this.ratingModel.findAll({
        where: { courseSlug }
      })

      if(!ratings) {
        res.status(404).json({
          status: "Fail",
          message: "No ratings has found"
        })
      }

      res.status(200).json({
        status: "OK",
        message: "Rating successfully created",
        data: ratings
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: "Fail",
        message: error.message
      })
    }
  }

  handleGetRatingList = async (req, res) => {
    try {
      const ratings = await this.ratingModel.findAll()

      if(!ratings) {
        res.status(404).json({
          status: "Fail",
          message: "No ratings has found"
        })
      }

      res.status(200).json({
        status: "OK",
        message: "Rating list successfully retrieved",
        data: ratings
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: "Fail",
        message: error.message
      })
    }
  }

  handleDeleteRating = async (req, res) => {
    try {
      const { id } = req.params

      const rating = await this.ratingModel.findByPk(id)

      if(!rating) {
        res.status(404).json({
          status: "Fail",
          message: "Rating not found"
        })
      }

      await rating.destroy()
      res.status(204).end();
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: "Fail",
        message: error.message
      })
    }
  }
}

module.exports = RatingController