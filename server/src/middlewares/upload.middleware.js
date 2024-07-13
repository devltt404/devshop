import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CLOUDINARY } from "../constants/index.js";
import logger from "../logger.js";

export const uploadCloud = ({ folderName, allowedFormats }) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats,
    params: {
      folder: `devshop/${folderName}`,
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: CLOUDINARY.MAX_SIZE, // keep images size < 5 MB
    },
  });
};

// Middleware to log file upload details
export const logUploadDetails = (req, res, next) => {
  if (req.file) {
    logger.info(
      `File uploaded to Cloudinary: ${req.file.filename} (${req.file.size} bytes)`
    );
  }
 
  if (req.files) {
    req.files.forEach((file) => {
      logger.info(
        `File uploaded to Cloudinary: ${file.filename} (${file.size} bytes)`
      );
    });
  }

  next();
};
