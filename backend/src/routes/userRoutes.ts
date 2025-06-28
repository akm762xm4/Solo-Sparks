import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", protect, getUserProfile);

export default router;
