class CommentController {
  constructor({ commentModel, courseModel, userModel}) {
    this.commentModel = commentModel
    this.courseModel = courseModel
    this.userModel = userModel
  }

  handleCreateComment = async (req, res) => {
    try {
      const { courseSlug } = req.params
      const { 
        userId,
        comment_content,
      } = req.body

      const user = await this.userModel.findByPk(userId)
      const firstName = user.firstName
      const lastName = user.lastName
      const photoProfile = user.photoProfile

      if(!user) {
        res.status(404).json({
          status: "Fail",
          message: "User not found or not login"
        })
      }

      const comment = await this.commentModel.create({
        userData: {
          id: userId,
          firstName,
          lastName,
          photoProfile
        },
        comment: comment_content,
        courseSlug
      })

      res.status(201).json({
        status: 'OK',
        message: 'successfully created article',
        data: [comment]
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message,
      })
    }
  }

  handleGetComments = async (req, res) => {
    try {
      const { courseSlug } = req.params
      const comments = await this.commentModel.findAll({
        where: { courseSlug: courseSlug }
      })
      res.status(201).json({
        status: 'OK',
        message: 'successfully created article',
        data: comments
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message,
      })
    }
  }

  handleGetCommentList = async (req, res) => {
    try {
      const comments = await this.commentModel.findAll()

      if(!comments) {
        res.status(404).json({
          status: "Fail",
          message: "No comment has found"
        })
      }

      res.status(200).json({
        status: "OK",
        message: "Comment list successfully retrieved",
        data: comments
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message,
      })
    }
  }

  handleDeleteComment = async (req, res) => {
    try {
      const { id } = req.params

      //check if comment exist
      const comment = await this.commentModel.findByPk(id)
      if(!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      await comment.destroy()
      res.status(204).end();
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Fail',
        message: error.message,
      })
    }
  }
}

module.exports = CommentController