import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/userModel";
import UserProfile from "./src/models/userProfileModel";
import Reflection from "./src/models/reflectionModel";
import Redemption from "./src/models/redemptionModel";
import { REWARDS } from "./src/config/rewardsConfig";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const demoImages = [
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/v1690000000/landscape.jpg",
];
const demoAudio = [
  "https://res.cloudinary.com/demo/video/upload/v1690000000/sample.mp3",
  "https://res.cloudinary.com/demo/video/upload/v1690000000/sample2.mp3",
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Overwrite existing data
  await User.deleteMany({});
  await UserProfile.deleteMany({});
  await Reflection.deleteMany({});
  await Redemption.deleteMany({});

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // Create demo users
  const users = await User.insertMany([
    {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      sparkPoints: 120,
      questsAssigned: 10,
      questsCompleted: 8,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword,
      sparkPoints: 80,
      questsAssigned: 7,
      questsCompleted: 5,
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: hashedPassword,
      sparkPoints: 200,
      questsAssigned: 15,
      questsCompleted: 15,
    },
    {
      name: "Diana",
      email: "diana@example.com",
      password: hashedPassword,
      sparkPoints: 60,
      questsAssigned: 5,
      questsCompleted: 3,
    },
    {
      name: "Eve",
      email: "eve@example.com",
      password: hashedPassword,
      sparkPoints: 30,
      questsAssigned: 3,
      questsCompleted: 1,
    },
  ]);

  // Add 3 more diverse users
  const moreUsers = await User.insertMany([
    {
      name: "Fiona",
      email: "fiona@example.com",
      password: hashedPassword,
      sparkPoints: 150,
      questsAssigned: 12,
      questsCompleted: 10,
    },
    {
      name: "George",
      email: "george@example.com",
      password: hashedPassword,
      sparkPoints: 95,
      questsAssigned: 8,
      questsCompleted: 6,
    },
    {
      name: "Hannah",
      email: "hannah@example.com",
      password: hashedPassword,
      sparkPoints: 180,
      questsAssigned: 14,
      questsCompleted: 13,
    },
  ]);
  users.push(...moreUsers);

  // Helper to generate a week of mood logs
  function generateMoodLog(
    moods: {
      general: string;
      frequency: string;
      triggers: string[];
      copingMechanisms: string[];
    }[]
  ) {
    return Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - 86400000 * (6 - i)),
      general: moods[i % moods.length].general,
      frequency: moods[i % moods.length].frequency,
      triggers: moods[i % moods.length].triggers,
      copingMechanisms: moods[i % moods.length].copingMechanisms,
    }));
  }

  // Add rich profiles for all users
  const allProfiles = [
    // ...existing 3 profiles...
    // Fiona
    {
      user: users[3]._id,
      mood: {
        general: "Content",
        frequency: "sometimes",
        triggers: ["Nature", "Music"],
        copingMechanisms: ["Yoga", "Painting"],
      },
      personalityTraits: {
        mbti: "ISFP",
        enneagram: "4",
        bigFive: {
          openness: 85,
          conscientiousness: 55,
          extraversion: 35,
          agreeableness: 80,
          neuroticism: 40,
        },
      },
      emotionalNeeds: {
        primary: ["Creativity", "Connection"],
        secondary: ["Recognition"],
        unmetNeeds: ["Adventure"],
        supportPreferences: ["Empathy", "Quality Time"],
      },
      selfPerception: {
        strengths: ["Creativity", "Compassion"],
        weaknesses: ["Indecisiveness"],
        growthAreas: ["Assertiveness", "Routine"],
        values: ["Authenticity", "Kindness"],
      },
      questResponses: {
        pastChallenges: ["Moving abroad", "Career change"],
        copingStrategies: ["Art journaling", "Meditation"],
        futureGoals: ["Exhibit artwork", "Travel solo"],
        supportSystem: ["Friends", "Art community"],
      },
      completedSteps: [
        "mood",
        "personalityTraits",
        "emotionalNeeds",
        "selfPerception",
        "questResponses",
      ],
      isOnboardingComplete: true,
      lastUpdated: new Date(),
      moodLog: generateMoodLog([
        {
          general: "Content",
          frequency: "sometimes",
          triggers: ["Nature"],
          copingMechanisms: ["Yoga"],
        },
        {
          general: "Happy",
          frequency: "often",
          triggers: ["Music"],
          copingMechanisms: ["Painting"],
        },
        {
          general: "Neutral",
          frequency: "rarely",
          triggers: ["Routine"],
          copingMechanisms: ["Reading"],
        },
        {
          general: "Anxious",
          frequency: "sometimes",
          triggers: ["Deadlines"],
          copingMechanisms: ["Breathing"],
        },
      ]),
      questsAssigned: 12,
      questsCompleted: 10,
    },
    // George
    {
      user: users[4]._id,
      mood: {
        general: "Neutral",
        frequency: "rarely",
        triggers: ["Workload"],
        copingMechanisms: ["Gaming", "Cooking"],
      },
      personalityTraits: {
        mbti: "ESTP",
        enneagram: "7",
        bigFive: {
          openness: 60,
          conscientiousness: 50,
          extraversion: 75,
          agreeableness: 65,
          neuroticism: 45,
        },
      },
      emotionalNeeds: {
        primary: ["Adventure", "Fun"],
        secondary: ["Achievement"],
        unmetNeeds: ["Stability"],
        supportPreferences: ["Encouragement", "Shared Activities"],
      },
      selfPerception: {
        strengths: ["Adaptability", "Optimism"],
        weaknesses: ["Impulsiveness"],
        growthAreas: ["Planning", "Patience"],
        values: ["Freedom", "Loyalty"],
      },
      questResponses: {
        pastChallenges: ["Job loss", "Moving cities"],
        copingStrategies: ["Sports", "Cooking"],
        futureGoals: ["Start a business", "Run a marathon"],
        supportSystem: ["Family", "Colleagues"],
      },
      completedSteps: [
        "mood",
        "personalityTraits",
        "emotionalNeeds",
        "selfPerception",
        "questResponses",
      ],
      isOnboardingComplete: true,
      lastUpdated: new Date(),
      moodLog: generateMoodLog([
        {
          general: "Neutral",
          frequency: "rarely",
          triggers: ["Workload"],
          copingMechanisms: ["Gaming"],
        },
        {
          general: "Happy",
          frequency: "sometimes",
          triggers: ["Friends"],
          copingMechanisms: ["Cooking"],
        },
        {
          general: "Stressed",
          frequency: "sometimes",
          triggers: ["Deadlines"],
          copingMechanisms: ["Walking"],
        },
        {
          general: "Content",
          frequency: "often",
          triggers: ["Success"],
          copingMechanisms: ["Music"],
        },
      ]),
      questsAssigned: 8,
      questsCompleted: 6,
    },
    // Hannah
    {
      user: users[5]._id,
      mood: {
        general: "Happy",
        frequency: "often",
        triggers: ["Family", "Achievements"],
        copingMechanisms: ["Running", "Cooking"],
      },
      personalityTraits: {
        mbti: "INFJ",
        enneagram: "2",
        bigFive: {
          openness: 75,
          conscientiousness: 70,
          extraversion: 55,
          agreeableness: 90,
          neuroticism: 35,
        },
      },
      emotionalNeeds: {
        primary: ["Connection", "Purpose and Meaning"],
        secondary: ["Recognition"],
        unmetNeeds: ["Adventure"],
        supportPreferences: ["Active Listening", "Encouragement"],
      },
      selfPerception: {
        strengths: ["Empathy", "Dedication"],
        weaknesses: ["Overthinking"],
        growthAreas: ["Self-care", "Boundaries"],
        values: ["Compassion", "Growth"],
      },
      questResponses: {
        pastChallenges: ["Family illness", "Moving abroad"],
        copingStrategies: ["Journaling", "Running"],
        futureGoals: ["Write a book", "Travel more"],
        supportSystem: ["Partner", "Friends"],
      },
      completedSteps: [
        "mood",
        "personalityTraits",
        "emotionalNeeds",
        "selfPerception",
        "questResponses",
      ],
      isOnboardingComplete: true,
      lastUpdated: new Date(),
      moodLog: generateMoodLog([
        {
          general: "Happy",
          frequency: "often",
          triggers: ["Family"],
          copingMechanisms: ["Running"],
        },
        {
          general: "Content",
          frequency: "sometimes",
          triggers: ["Achievements"],
          copingMechanisms: ["Cooking"],
        },
        {
          general: "Neutral",
          frequency: "rarely",
          triggers: ["Routine"],
          copingMechanisms: ["Reading"],
        },
        {
          general: "Anxious",
          frequency: "sometimes",
          triggers: ["Deadlines"],
          copingMechanisms: ["Breathing"],
        },
      ]),
      questsAssigned: 14,
      questsCompleted: 13,
    },
  ];

  // Add the new profiles to the DB
  await UserProfile.insertMany(allProfiles);

  // Add 4 reflections per user
  for (let i = 0; i < users.length; i++) {
    await Reflection.create([
      {
        user: users[i]._id,
        questTitle: "Gratitude Journal",
        questType: "daily",
        text: `Today I am grateful for my family and health. (User ${i + 1})`,
        imageUrl: demoImages[i % demoImages.length],
        audioUrl: demoAudio[i % demoAudio.length],
        qualityScore: 8.5,
      },
      {
        user: users[i]._id,
        questTitle: "Mindful Walk",
        questType: "daily",
        text: `I took a mindful walk and noticed the beauty around me. (User ${
          i + 1
        })`,
        imageUrl: demoImages[(i + 1) % demoImages.length],
        audioUrl: demoAudio[(i + 1) % demoAudio.length],
        qualityScore: 7.2,
      },
      {
        user: users[i]._id,
        questTitle: "Acts of Kindness",
        questType: "weekly",
        text: `I helped a friend in need and it made me feel fulfilled. (User ${
          i + 1
        })`,
        imageUrl: demoImages[i % demoImages.length],
        audioUrl: demoAudio[i % demoAudio.length],
        qualityScore: 9.1,
      },
      {
        user: users[i]._id,
        questTitle: "Personal Reflection",
        questType: "weekly",
        text: `Reflected on my week and set new goals. (User ${i + 1})`,
        imageUrl: demoImages[(i + 1) % demoImages.length],
        audioUrl: demoAudio[(i + 1) % demoAudio.length],
        qualityScore: 8.0,
      },
    ]);
  }

  // Seed demo redemptions for each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // Pick 3 rewards for each user (cycling through the REWARDS array)
    const rewardsToRedeem = [
      REWARDS[i % REWARDS.length],
      REWARDS[(i + 2) % REWARDS.length],
      REWARDS[(i + 4) % REWARDS.length],
    ];
    for (let j = 0; j < rewardsToRedeem.length; j++) {
      const reward = rewardsToRedeem[j];
      await Redemption.create({
        user: user._id,
        rewardId: reward.id,
        rewardName: reward.name,
        rewardDescription: reward.description,
        cost: reward.cost,
        redeemedAt: new Date(Date.now() - 86400000 * (j + 1)),
        status: j === 0 ? "active" : "used",
        expiresAt:
          reward.type === "temporary"
            ? new Date(
                Date.now() +
                  86400000 * (reward.duration ? reward.duration / 24 : 1)
              )
            : undefined,
      });
    }
  }

  console.log("Demo data seeded!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
