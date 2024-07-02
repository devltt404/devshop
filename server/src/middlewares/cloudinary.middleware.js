import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import serverConfig from "../configs/server.config.js";

cloudinary.config({
  cloud_name: serverConfig.cloudinary.name,
  api_key: serverConfig.cloudinary.apiKey,
  api_secret: serverConfig.cloudinary.apiSecret,
});

function uploadCloud(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png"],
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`;
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });
}

export default uploadCloud;
