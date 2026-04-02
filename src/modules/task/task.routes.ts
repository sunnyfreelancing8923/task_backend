import { Router } from "express";
import { createTaskController, getTasksController } from "./task.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTaskController);
router.get("/", authMiddleware, getTasksController);

export default router;
