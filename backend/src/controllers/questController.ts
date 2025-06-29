import { Request, Response } from "express";
import { getPersonalizedQuest } from "../services/questEngineService";
import { IAuthRequest } from "../middleware/authMiddleware";
import User from "../models/userModel";
import Reflection from "../models/reflectionModel";

export const getTodayQuest = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const quest = await getPersonalizedQuest(userId);
    res.json({ success: true, data: quest });
  } catch (error) {
    console.error("Quest Engine error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate quest" });
  }
};

export const startQuest = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { questId } = req.body;

    // Validate questId
    if (!questId) {
      res.status(400).json({
        success: false,
        message: "Quest ID is required",
      });
    }

    // Check if user has already started this quest today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingReflection = await Reflection.findOne({
      user: userId,
      questTitle: questId,
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (existingReflection) {
      res.status(400).json({
        success: false,
        message: "Quest already started today",
      });
    }

    // Get the quest details (in a real app, you'd fetch from a quest database)
    const quest = await getPersonalizedQuest(userId);

    // Create a reflection entry to mark quest as started
    const reflection = new Reflection({
      user: userId,
      questTitle: quest.title,
      questType: quest.type,
      text: `Started quest: ${quest.title}`,
      qualityScore: 0, // Will be updated when completed
      createdAt: new Date(),
    });

    await reflection.save();

    // Update user's quests assigned count
    await User.findByIdAndUpdate(userId, { $inc: { questsAssigned: 1 } });

    // Return the started quest data
    const startedQuest = {
      id: questId,
      title: quest.title,
      description: quest.description,
      category: "emotional", // Default category
      status: "active",
      progress: 0,
      difficulty: "easy",
      reward: 50,
      dueDate: todayEnd.toISOString(),
      estimatedTime: "15 min",
      type: quest.type,
      suggestedBy: quest.suggestedBy,
      createdAt: new Date().toISOString(),
      completedAt: undefined,
    };

    res.json({ success: true, data: startedQuest });
  } catch (error) {
    console.error("Quest start error:", error);
    res.status(500).json({ success: false, message: "Failed to start quest" });
  }
};

export const getQuestHistory = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    // Get all reflections to determine completed quests
    const reflections = await Reflection.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 reflections

    // Group reflections by quest title to track completion
    const questCompletionMap = new Map();

    reflections.forEach((reflection) => {
      const questTitle = reflection.questTitle;
      if (!questCompletionMap.has(questTitle)) {
        questCompletionMap.set(questTitle, {
          id: `${questTitle
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .substring(0, 10)}-${reflection.createdAt.getTime()}`,
          title: questTitle,
          description: `Completed: ${questTitle}`,
          category: "emotional", // Default category
          status: "completed",
          progress: 100,
          difficulty: "easy",
          reward: 50,
          dueDate: reflection.createdAt.toISOString(),
          estimatedTime: "15 min",
          type: reflection.questType || "daily",
          suggestedBy: "system",
          createdAt: reflection.createdAt.toISOString(),
          completedAt: reflection.createdAt.toISOString(),
        });
      }
    });

    const questHistory = Array.from(questCompletionMap.values());

    res.json(questHistory);
  } catch (error) {
    console.error("Quest history error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get quest history" });
  }
};

export const getActiveQuests = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    // Get today's quest
    const todayQuest = await getPersonalizedQuest(userId);

    // Check if today's quest has been completed
    const todayReflection = await Reflection.findOne({
      user: userId,
      questTitle: todayQuest.title,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const activeQuests = [];

    if (!todayReflection) {
      // Format the quest to match frontend expectations
      const formattedQuest = {
        id: `${todayQuest.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 10)}-${new Date().getTime()}`,
        title: todayQuest.title,
        description: todayQuest.description,
        category: "emotional", // Default category
        status: "active",
        progress: 0,
        difficulty: "easy",
        reward: 50,
        dueDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        estimatedTime: "15 min",
        type: todayQuest.type,
        suggestedBy: todayQuest.suggestedBy,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
      };
      activeQuests.push(formattedQuest);
    }

    res.json(activeQuests);
  } catch (error) {
    console.error("Active quests error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get active quests" });
  }
};

export const completeQuest = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { questId, reflectionText } = req.body;

    // Find the quest by ID (in this case, we'll use the quest title from the ID)
    // The frontend generates IDs based on title, so we need to extract the title
    const questTitle = questId.split("-")[0]; // Extract title from generated ID

    // Create a reflection for this quest completion
    const reflection = new Reflection({
      user: userId,
      questTitle: questTitle,
      questType: "daily", // Default to daily, could be enhanced
      text: reflectionText || `Completed quest: ${questTitle}`,
      qualityScore: 85, // Default quality score for quest completion
      createdAt: new Date(),
    });

    await reflection.save();

    // Update user's spark points (assuming 50 points for quest completion)
    await User.findByIdAndUpdate(userId, { $inc: { sparkPoints: 50 } });

    // Return the completed quest data
    const completedQuest = {
      id: questId,
      title: questTitle,
      description: `Completed: ${questTitle}`,
      category: "emotional", // Default category
      status: "completed",
      progress: 100,
      difficulty: "easy",
      reward: 50,
      type: "daily",
      suggestedBy: "system",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    res.json({ success: true, data: completedQuest });
  } catch (error) {
    console.error("Quest completion error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to complete quest" });
  }
};
