import { Response } from "express";
import { createTask, getTasks } from "./task.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await createTask(req.user!.userId, title, description);

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasksController = async (req: AuthRequest, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
