import prisma from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export const registerUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }

  const decoded = verifyRefreshToken(refreshToken) as { userId: number };

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken(user.id);

  return { accessToken };
};

export const logoutUser = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return true;
};
