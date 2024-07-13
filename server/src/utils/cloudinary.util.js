import { v2 as cloudinary } from "cloudinary";
import logger from "../logger.js";

function extractFilename(path) {
  return path
    .substring(path.indexOf("/devshop") + 1)
    .split(".")
    .slice(0, -1)
    .join(".");
}

async function deleteFile(filename) {
  try {
    const { result } = await cloudinary.uploader.destroy(filename);
    logger.info(`Deleted ${filename} from Cloudinary with result ${result}`);
  } catch (error) {
    logger.error(
      `Error deleting file ${filename} from Cloudinary: ${error.message}`
    );
  }
}

async function deleteFiles(filenames) {
  try {
    await cloudinary.api.delete_resources_by_tag(filenames);
    logger.info(`Deleted ${filenames.length} files from Cloudinary`);
  } catch (error) {
    logger.error(`Error deleting files from Cloudinary: ${error.message}`);
  }
}

export async function deleteUploadByPath(path) {
  const filename = extractFilename(path);
  await deleteFile(filename);
}

export async function deleteUploadByPaths(paths) {
  const filenames = paths.map(extractFilename);
  await deleteFiles(filenames);
}

export async function deleteUploadByFile(file) {
  await deleteFile(file.filename);
}

export async function deleteUploadByFiles(files) {
  const filenames = files.map((file) => file.filename);
  await deleteFiles(filenames);
}
