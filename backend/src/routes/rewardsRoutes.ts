import express from "express";
import {
  redeemReward,
  getRewards,
  getUserPoints,
  getRedemptionHistory,
  getActiveRedemptions,
} from "../controllers/rewardsController";
import { protect } from "../middleware/authMiddleware";
import { RequestHandler } from "express";

const router = express.Router();

router.use(protect);

// Get all rewards or rewards by category
router.get("/", getRewards);

// Get user's spark points and stats
router.get("/points", getUserPoints as RequestHandler);

// Get redemption history
router.get("/history", getRedemptionHistory);

// Get active redemptions
router.get("/active", getActiveRedemptions);

// Redeem a reward
router.post("/redeem", redeemReward as RequestHandler);

export default router;
