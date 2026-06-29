import cloudinary from "./cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The folder in Cloudinary to upload the image to
 * @param {string} mimetype - The mime type of the file
 * @returns {Promise<any>} The Cloudinary upload response
 */
export const uploadImageToCloudinary = (fileBuffer: Buffer, folder: string = "lakecity-hospital", mimetype: string = "image/png"): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      // Fallback to base64 if Cloudinary is not configured
      const base64Str = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
      console.warn("Cloudinary not configured. Falling back to base64 data URI.");
      return resolve({
        secure_url: base64Str,
        public_id: "local_" + Date.now(),
        format: mimetype.split("/")[1] || "png"
      });
    }

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
