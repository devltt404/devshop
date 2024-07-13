import { v2 as cloudinary } from "cloudinary";
import serverConfig from "./configs/server.config.js";

cloudinary.config({
  cloud_name: serverConfig.cloudinary.name,
  api_key: serverConfig.cloudinary.apiKey,
  api_secret: serverConfig.cloudinary.apiSecret,
});
