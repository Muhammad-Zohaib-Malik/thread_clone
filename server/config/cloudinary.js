
import { v2 as cloudinary } from 'cloudinary'

export const cloudinaryConfig = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_CLOUD_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('cloudianry configuration successfully')

  } catch (error) {
    console.log('error while configure config cloudinary')
    console.log(error)
  }
}


