import { Request, Response } from "express";
import Reflection from "../models/reflectionModel";
import User from "../models/userModel";
import UserProfile from "../models/userProfileModel";
import { IAuthRequest } from "../middleware/authMiddleware";
import { uploadImage, uploadAudio } from "../services/cloudinaryService";

function calculatePoints(
  questType: string,
  text?: string,
  imageUrl?: string,
  audioUrl?: string
) {
  let points = questType === "weekly" ? 25 : 10;
  if (text && text.length > 100) points += 5;
  if (imageUrl) points += 5;
  if (audioUrl) points += 5;
  return points;
}

function calculateQualityScore(
  text?: string,
  imageUrl?: string,
  audioUrl?: string
) {
  let score = 0;
  if (text) score += Math.min(text.length / 20, 5); // up to 5 points for text length
  if (imageUrl) score += 2;
  if (audioUrl) score += 2;
  // Optionally, add sentiment or grammar checks here
  return Math.round(score * 10) / 10;
}

export const createReflection = async (req: IAuthRequest, res: Response) => {
  try {
    const { questTitle, questType, text, mood } = req.body;
    const user = req.user._id;
    let imageUrl, audioUrl;

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.image && files.image[0]) {
        const imageResult = await uploadImage(files.image[0]);
        imageUrl = imageResult.secure_url;
      }
      if (files.audio && files.audio[0]) {
        const audioResult = await uploadAudio(files.audio[0]);
        audioUrl = audioResult.secure_url;
      }
    }

    // Calculate quality score
    const qualityScore = calculateQualityScore(text, imageUrl, audioUrl);

    const reflection = await Reflection.create({
      user,
      questTitle,
      questType,
      text,
      imageUrl,
      audioUrl,
      qualityScore,
    });

    // Award Spark Points
    const points = calculatePoints(questType, text, imageUrl, audioUrl);
    await User.findByIdAndUpdate(user, {
      $inc: { sparkPoints: points, questsCompleted: 1 },
    });

    // Optionally, append to moodLog if mood data is present
    if (mood) {
      await UserProfile.findOneAndUpdate(
        { user },
        { $push: { moodLog: { ...mood, date: new Date() } } }
      );
    }

    res.status(201).json({
      success: true,
      data: reflection,
      pointsAwarded: points,
      qualityScore,
    });
  } catch (error) {
    console.error("Reflection upload error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit reflection" });
  }
};

export const getReflections = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user._id;
    const reflections = await Reflection.find({ user }).sort({ createdAt: -1 });
    res.json(reflections);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reflections" });
  }
};

export const deleteReflection = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const reflection = await Reflection.findOne({ _id: id, user });
    if (!reflection) {
      res.status(404).json({ success: false, message: "Reflection not found" });
    }
    await reflection?.deleteOne();
    res.json({ success: true, message: "Reflection deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete reflection" });
  }
};
