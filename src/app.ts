import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes"; // ✅ ADD THIS
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes); // ✅ ADD THIS

// error handler (always last)
app.use(errorMiddleware);

export default app;
