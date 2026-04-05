import { Router } from "express";
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
  toggleTaskController,
} from "./task.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTaskController);
router.get("/", authMiddleware, getTasksController);
router.patch("/:id", authMiddleware, updateTaskController);
router.delete("/:id", authMiddleware, deleteTaskController);
router.patch("/:id/toggle", authMiddleware, toggleTaskController);

export default router;
