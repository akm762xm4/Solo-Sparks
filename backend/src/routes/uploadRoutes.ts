import express from "express";
import { uploadFile } from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/multerMiddleware";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

export default router;
