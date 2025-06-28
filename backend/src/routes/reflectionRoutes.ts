import express from "express";
import {
  createReflection,
  getReflections,
  deleteReflection,
} from "../controllers/reflectionController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.use(protect);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  createReflection
);

router.get("/", getReflections);

router.delete("/:id", deleteReflection);

export default router;
