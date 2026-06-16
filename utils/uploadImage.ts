import cloudinary from "./cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The folder in Cloudinary to upload the image to
 * @returns {Promise<any>} The Cloudinary upload response
 */
export const uploadImageToCloudinary = (fileBuffer: Buffer, folder: string = "lakecity-hospital"): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
