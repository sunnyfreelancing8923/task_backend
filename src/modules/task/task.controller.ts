import { Response, NextFunction } from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  toggleTaskStatus,
} from "./task.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../../validators/task.validator";

export const createTaskController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = createTaskSchema.parse(req.body);

    const task = await createTask(
      req.user!.userId,
      parsed.title,
      parsed.description,
    );

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = "1", limit = "10", status, search } = req.query;

    const data = await getTasks(
      req.user!.userId,
      Number(page),
      Number(limit),
      status as string,
      search as string,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskId = Number(req.params.id);
    const parsed = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTask(req.user!.userId, taskId, parsed);

    res.status(200).json({
      success: true,
      message: "Task updated",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskId = Number(req.params.id);

    await deleteTask(req.user!.userId, taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTaskController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskId = Number(req.params.id);

    const task = await toggleTaskStatus(req.user!.userId, taskId);

    res.status(200).json({
      success: true,
      message: "Task status toggled",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
