import { Response, NextFunction } from "express";
import { IAuthRequest } from "../middleware/authMiddleware";
import { uploadImage } from "../services/cloudinaryService";

const uploadFile = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const result = await uploadImage(req.file);
    if (result) {
      res.status(200).json({
        message: "File uploaded successfully",
        url: result.secure_url,
      });
    } else {
      res.status(500).json({ message: "Image upload failed" });
    }
  } catch (error) {
    next(error);
  }
};

export { uploadFile };
