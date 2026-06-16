import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../utils/uploadImage.js";

// Upload Image Controller
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    const folder = req.body.folder || "lakecity-hospital/misc";
    const result = await uploadImageToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      },
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};
