import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { error } from "node:console";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import { initScheduler } from "./services/schedulerService.js";

const app = express();
await connectDB();
const port = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

//global error handler function
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res
    .status(500)
    .json({ message: err.response?.data?.message || "Something went wrong" });
});

app.use("/api/auth", authRouter);
app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);
app.use("/api/activity", activityRouter);

//initialize scheduler
initScheduler();

app.get("/", (_req: Request, res: Response) => {
  res.json("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
