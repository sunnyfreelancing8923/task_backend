import prisma from "../../config/prisma";

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
