import express from "express";
import {
  getTodayQuest,
  getQuestHistory,
  getActiveQuests,
  startQuest,
  completeQuest,
} from "../controllers/questController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);
router.get("/today", getTodayQuest);
router.get("/history", getQuestHistory);
router.get("/active", getActiveQuests);
router.post("/start", startQuest);
router.post("/complete", completeQuest);

export default router;
