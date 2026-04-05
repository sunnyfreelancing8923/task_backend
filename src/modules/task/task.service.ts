import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export const createTask = async (
  userId: number,
  title: string,
  description?: string,
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
};

export const getTasks = async (
  userId: number,
  page: number,
  limit: number,
  status?: string,
  search?: string,
) => {
  const where: any = {
    userId,
    deletedAt: null,
  };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const tasks = await prisma.task.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.task.count({ where });

  return {
    tasks,
    total,
    page,
    limit,
  };
};

export const updateTask = async (userId: number, taskId: number, data: any) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const toggleTaskStatus = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";

  return prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};
