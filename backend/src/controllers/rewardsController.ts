import { Request, Response } from "express";
import User from "../models/userModel";
import Redemption from "../models/redemptionModel";
import { IAuthRequest } from "../middleware/authMiddleware";
import {
  REWARDS,
  getRewardById,
  getRewardsByCategory,
} from "../config/rewardsConfig";

export const getRewards = async (req: IAuthRequest, res: Response) => {
  try {
    const { category } = req.query;

    let rewards = REWARDS;

    if (category && typeof category === "string") {
      rewards = getRewardsByCategory(category as any);
    }

    res.json(rewards);
  } catch (error) {
    console.error("Get rewards error:", error);
    res.status(500).json({ success: false, message: "Failed to get rewards" });
  }
};

export const getUserPoints = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        sparkPoints: user.sparkPoints || 0,
        questsAssigned: user.questsAssigned || 0,
        questsCompleted: user.questsCompleted || 0,
      },
    });
  } catch (error) {
    console.error("Get user points error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get user points" });
  }
};

export const redeemReward = async (req: IAuthRequest, res: Response) => {
  try {
    const { rewardId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    const reward = getRewardById(rewardId);
    if (!reward) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reward" });
    }

    if (user?.sparkPoints && user.sparkPoints < reward.cost) {
      res.status(400).json({
        success: false,
        message: `Not enough Spark Points. You need ${reward.cost} points, but you have ${user.sparkPoints}.`,
      });
    }

    // Deduct points
    user!.sparkPoints -= reward.cost;
    await user?.save();

    // Create redemption record
    const redemption = new Redemption({
      user: userId,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardDescription: reward.description,
      cost: reward.cost,
      status: "active",
      expiresAt:
        reward.type === "temporary" && reward.duration
          ? new Date(Date.now() + reward.duration * 60 * 60 * 1000) // Convert hours to milliseconds
          : undefined,
    });

    await redemption.save();

    res.json({
      success: true,
      reward: {
        id: reward.id,
        name: reward.name,
        description: reward.description,
        category: reward.category,
        type: reward.type,
        duration: reward.duration,
      },
      remainingPoints: user?.sparkPoints,
      redemptionId: redemption._id,
    });
  } catch (error) {
    console.error("Reward redeem error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to redeem reward" });
  }
};

export const getRedemptionHistory = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { status, limit = 20 } = req.query;

    let query: any = { user: userId };

    if (status && typeof status === "string") {
      query.status = status;
    }

    const redemptions = await Redemption.find(query)
      .sort({ redeemedAt: -1 })
      .limit(Number(limit))
      .populate("user", "name email");

    res.json({
      success: true,
      redemptions: redemptions.map((redemption) => ({
        id: redemption._id,
        rewardId: redemption.rewardId,
        rewardName: redemption.rewardName,
        rewardDescription: redemption.rewardDescription,
        cost: redemption.cost,
        redeemedAt: redemption.redeemedAt,
        status: redemption.status,
        expiresAt: redemption.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Get redemption history error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get redemption history" });
  }
};

export const getActiveRedemptions = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;

    const activeRedemptions = await Redemption.find({
      user: userId,
      status: "active",
    }).sort({ redeemedAt: -1 });

    res.json({
      success: true,
      activeRedemptions: activeRedemptions.map((redemption) => ({
        id: redemption._id,
        rewardId: redemption.rewardId,
        rewardName: redemption.rewardName,
        rewardDescription: redemption.rewardDescription,
        cost: redemption.cost,
        redeemedAt: redemption.redeemedAt,
        expiresAt: redemption.expiresAt,
        isExpired: redemption.expiresAt
          ? new Date() > redemption.expiresAt
          : false,
      })),
    });
  } catch (error) {
    console.error("Get active redemptions error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get active redemptions" });
  }
};
