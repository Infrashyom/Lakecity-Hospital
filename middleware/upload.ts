import multer from "multer";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Set file filter to allow only image files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create the Multer upload middleware with a size limit (e.g., 5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

export default upload;
