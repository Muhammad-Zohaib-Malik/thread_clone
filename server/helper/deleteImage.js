import { v2 as cloudinary } from 'cloudinary'

export const deleteImageFromCloudinary = async (imageId) => {
  try {

    const result = await cloudinary.uploader.destroy(imageId)
  } catch (error) {
    console.log(error)

  }

}