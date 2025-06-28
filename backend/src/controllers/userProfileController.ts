import { Request, Response } from "express";
import UserProfile from "../models/userProfileModel";
import { IAuthRequest } from "../middleware/authMiddleware";

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getUserProfile = async (req: IAuthRequest, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      // Create a new profile if it doesn't exist
      const newProfile = await UserProfile.create({
        user: req.user._id,
        completedSteps: [],
      });

      res.json({
        success: true,
        data: newProfile,
        message: "New profile created",
      });
    }

    res.json({
      success: true,
      data: profile,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user profile step
// @route   PUT /api/profile/step/:step
// @access  Private
export const updateProfileStep = async (req: IAuthRequest, res: Response) => {
  try {
    const { step } = req.params;
    const stepData = req.body;

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await UserProfile.create({
        user: req.user._id,
        completedSteps: [],
      });
    }

    // Update the specific step data
    profile.set(step, stepData);

    // Add step to completedSteps if not already present
    if (!profile.completedSteps.includes(step)) {
      profile.completedSteps.push(step);
    }

    // Update lastUpdated
    profile.lastUpdated = new Date();

    // Check if all required steps are completed
    const requiredSteps = [
      "mood",
      "personalityTraits",
      "emotionalNeeds",
      "selfPerception",
      "questResponses",
    ];
    profile.isOnboardingComplete = requiredSteps.every((step) =>
      profile.completedSteps.includes(step)
    );

    await profile.save();

    res.json({
      success: true,
      data: profile,
      message: `Profile ${step} updated successfully`,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Skip profile step
// @route   POST /api/profile/step/:step/skip
// @access  Private
export const skipProfileStep = async (req: IAuthRequest, res: Response) => {
  try {
    const { step } = req.params;
    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await UserProfile.create({
        user: req.user._id,
        completedSteps: [],
      });
    }

    // Add step to completedSteps if not already present
    if (!profile.completedSteps.includes(step)) {
      profile.completedSteps.push(step);
    }

    // Update lastUpdated
    profile.lastUpdated = new Date();

    // Check if all steps are completed
    const requiredSteps = [
      "mood",
      "personalityTraits",
      "emotionalNeeds",
      "selfPerception",
      "questResponses",
    ];
    profile.isOnboardingComplete = requiredSteps.every((step) =>
      profile.completedSteps.includes(step)
    );

    await profile.save();

    res.json({
      success: true,
      data: profile,
      message: `Step ${step} skipped`,
    });
  } catch (error) {
    console.error("Skip step error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
