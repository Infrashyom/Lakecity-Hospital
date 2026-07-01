import multer from "multer";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Set file filter to allow only image files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/octet-stream") {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create the Multer upload middleware with a size limit (e.g., 20MB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB limit
  },
});

export default upload;
