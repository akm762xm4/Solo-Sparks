import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId;
  mood: {
    general: string;
    frequency: "rarely" | "sometimes" | "often" | "always";
    triggers: string[];
    copingMechanisms: string[];
  };
  personalityTraits: {
    mbti: string;
    enneagram: string;
    bigFive: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
  };
  emotionalNeeds: {
    primary: string[];
    secondary: string[];
    unmetNeeds: string[];
    supportPreferences: string[];
  };
  selfPerception: {
    strengths: string[];
    weaknesses: string[];
    growthAreas: string[];
    values: string[];
  };
  questResponses: {
    pastChallenges: string[];
    copingStrategies: string[];
    futureGoals: string[];
    supportSystem: string[];
  };
  completedSteps: string[];
  isOnboardingComplete: boolean;
  lastUpdated: Date;
  moodLog: {
    date: Date;
    general: string;
    frequency: string;
    triggers: string[];
    copingMechanisms: string[];
  }[];
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    mood: {
      general: String,
      frequency: {
        type: String,
        enum: ["rarely", "sometimes", "often", "always"],
      },
      triggers: [String],
      copingMechanisms: [String],
    },
    personalityTraits: {
      mbti: String,
      enneagram: String,
      bigFive: {
        openness: Number,
        conscientiousness: Number,
        extraversion: Number,
        agreeableness: Number,
        neuroticism: Number,
      },
    },
    emotionalNeeds: {
      primary: [String],
      secondary: [String],
      unmetNeeds: [String],
      supportPreferences: [String],
    },
    selfPerception: {
      strengths: [String],
      weaknesses: [String],
      growthAreas: [String],
      values: [String],
    },
    questResponses: {
      pastChallenges: [String],
      copingStrategies: [String],
      futureGoals: [String],
      supportSystem: [String],
    },
    completedSteps: [String],
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    moodLog: [
      {
        date: { type: Date, default: Date.now },
        general: String,
        frequency: String,
        triggers: [String],
        copingMechanisms: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);

export default UserProfile;
