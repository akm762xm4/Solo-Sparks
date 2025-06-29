import cloudinary from "../config/cloudinary";

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

export const uploadAudio = async (file: Express.Multer.File) => {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: "raw",
      folder: "reflections/audio",
    });
    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Audio upload failed");
  }
};
