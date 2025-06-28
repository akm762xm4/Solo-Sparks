import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadImage = async (file: Express.Multer.File) => {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Image upload failed");
  }
};

export const uploadToCloudinary = async (
  filePath: string,
  resourceType: "image" | "audio"
) => {
  // Cloudinary supports 'image', 'video', 'raw'. Use 'raw' for audio files.
  const cloudinaryResourceType = resourceType === "audio" ? "raw" : "image";
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: cloudinaryResourceType,
    folder: "reflections",
  });
  // Remove local file after upload
  fs.unlinkSync(filePath);
  return result;
};
