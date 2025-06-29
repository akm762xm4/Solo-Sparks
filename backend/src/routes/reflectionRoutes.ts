import express from "express";
import {
  createReflection,
  getReflections,
  deleteReflection,
} from "../controllers/reflectionController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/multerMiddleware";

const router = express.Router();

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
