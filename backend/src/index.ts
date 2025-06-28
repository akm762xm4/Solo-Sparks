import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import questRoutes from "./routes/questRoutes";
import reflectionRoutes from "./routes/reflectionRoutes";
import rewardsRoutes from "./routes/rewardsRoutes";

connectDB();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth routes
app.use("/api/auth", userRoutes);
// Upload routes
app.use("/api/upload", uploadRoutes);
// Profile routes
app.use("/api/profile", userProfileRoutes);
// Quest routes
app.use("/api/quests", questRoutes);
// Reflection routes
app.use("/api/reflections", reflectionRoutes);
// Rewards routes
app.use("/api/rewards", rewardsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
