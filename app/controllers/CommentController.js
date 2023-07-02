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
        firstName,
        lastName,
        userId,
        comment_content,
        image
      } = req.body

      const comment = await this.commentModel.create({
        courseSlug,
        firstName,
        lastName,
        userId,
        image,
        comment: comment_content
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