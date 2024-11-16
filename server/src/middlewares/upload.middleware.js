import multer from "multer";
import logger from "../configs/logger.config.js";
import { CLOUDINARY } from "../constants/index.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporary storage location
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadCloud = ({ folderName, allowedFormats }) => {
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Check for allowed formats
      const ext = file.mimetype.split("/")[1];
      if (!allowedFormats.includes(ext)) {
        return cb(new Error("Invalid file format"), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: CLOUDINARY.MAX_SIZE, // keep images size < 5 MB
    },
  });
};

export const logUploadDetails = (req, res, next) => {
  if (req.file) {
    logger.info(
      `File uploaded to Cloudinary: ${req.file.cloudinaryUrl} (${req.file.size} bytes)`
    );
  }

  if (req.files) {
    req.files.forEach((file) => {
      logger.info(
        `File uploaded to Cloudinary: ${file.cloudinaryUrl} (${file.size} bytes)`
      );
    });
  }

  next();
};
