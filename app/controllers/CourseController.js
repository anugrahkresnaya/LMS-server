const { Storage } = require('@google-cloud/storage')
const ApplicationController = require("./ApplicationController");
const imagekit = require('../lib/imageKitConfig')
const fs = require('fs')

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
      console.log('filesss', files)
  
      if (!files || files.length < 2) {
        res.status(400).json({ message: 'Both image and video files are required' });
        return;
      }

      let imageFile, videoFile;
      for (const file of files) {
        if (file.fieldname === 'image') {
          imageFile = file;
        } else if (file.fieldname === 'video') {
          videoFile = file;
        }
      }

      if (!imageFile || !videoFile) {
        res.status(400).json({ error: 'Please upload both an image and a video.' });
        return;
      }
  
      console.log('imagefile', imageFile)
      const imageUploadResponse = await uploadFile(imageFile)

      const videoUploadResponse = await uploadFile(videoFile)

      console.log('vid res: ', videoUploadResponse)

      const course = await this.courseModel.create({
        image: imageUploadResponse.publicUrl,
        video: videoUploadResponse.publicUrl,
      })
  
      res.status(200).json({
        status: 'OK',
        message: 'Success create course',
        data: [course],
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Failed to upload files' });
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

  getCourseFromRequest(req) {
    return this.courseModel.findByPk(req.params.id)
  }
}

module.exports = CourseController