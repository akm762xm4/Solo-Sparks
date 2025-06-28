import express from "express";
import {
  getUserProfile,
  updateProfileStep,
  skipProfileStep,
} from "../controllers/userProfileController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getUserProfile);
router.put("/step/:step", updateProfileStep);
router.post("/step/:step/skip", skipProfileStep);

export default router;
