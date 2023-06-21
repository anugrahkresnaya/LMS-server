const { Storage } = require('@google-cloud/storage')
const ApplicationController = require("./ApplicationController");
const imagekit = require('../lib/imageKitConfig')
const fs = require('fs');
const { default: slugify } = require('slugify');

const storage = new Storage({
  keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY,
  projectId: 'oceanz'
})
const bucketName = 'oceanz-bucket'

const uploadFile = (file) => {
  const { originalname, buffer } = file
  const filename = Date.now() + '_' + originalname
  const bucket = storage.bucket(bucketName)
  const fileBlob = bucket.file(filename)

  const stream = fileBlob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    }
  })

  return new Promise((resolve, reject) => {
    stream.on('error', reject)
    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileBlob.name}`
      resolve({ filename, publicUrl })
    })

    stream.end(buffer)
  })
}

class CourseController extends ApplicationController {
  constructor({ courseModel }) {
    super()
    this.courseModel = courseModel
  }

  createCourse = async (req, res) => {
    try {
      const files = req.files;
      console.log('files', files)
      const { title, description, price, paid, published } = req.body
        
      if (!files || files.length < 2) {
        res.status(400).json({ message: 'Both image and video files are required' });
        return;
      }

      let imageFile, videoFile, pdfFile;
      for (const file of files) {
        if (file.fieldname === 'image') {
          imageFile = file
        } else if (file.fieldname === 'video') {
          videoFile = file
        } else if (file.fieldname === 'pdf') {
          pdfFile = file
        }
      }

      if (!imageFile || !videoFile) {
        res.status(400).json({ error: 'Please upload both an image and a video.' });
        return;
      }
  
      const imageUploadResponse = await uploadFile(imageFile)

      const videoUploadResponse = await uploadFile(videoFile)

      const pdfUploadResponse = await uploadFile(pdfFile)

      const slugCourse = slugify(title, { lower: true })

      console.log('slugify', slugCourse)

      const course = await this.courseModel.create({
        title,
        description,
        price,
        paid,
        // published,
        image: imageUploadResponse.publicUrl,
        video: videoUploadResponse.publicUrl,
        pdf: pdfUploadResponse.publicUrl,
        slug: slugCourse
      })
  
      res.status(200).json({
        status: 'OK',
        message: 'Success create course',
        data: [course],
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Course with the same title already exists.' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  getCourseById = async (req, res) => {
    try {
      const course = await this.getCourseFromRequest(req)

      res.status(200).json({
        status: 'success',
        message: 'get course by id successful',
        data: [course],
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Failed to get course data' });
    }
  }

  getCourseBySlug = async (req, res) => {
    try {
      const { slug } = req.params
      console.log('slug: ', slug)
      const course = await this.courseModel.findOne({
        where: { slug }
      })

      console.log('course slug', course)

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.status(200).json({
        status: 'success',
        message: 'get course by id successful',
        data: course,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  }

  getCourseList = async (req, res) => {
    try {
      const courses = await this.courseModel.findAll()

      res.status(200).json({
        status: "OK",
        message: "success get course list",
        data: courses,
      })
    } catch (error) {
      console.log(error)
      res.status(404).json({ message: error.message })
    }
  }

  // handleUpdateCourse = async (req, res) => {
  //   try {
  //     const 
  //   } catch (error) {
      
  //   }
  // }

  getCourseFromRequest(req) {
    return this.courseModel.findByPk(req.params.id)
  }
}

module.exports = CourseController