import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../../validators/auth.validator";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const user = await registerUser(parsed.email, parsed.password, parsed.name);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const data = await loginUser(parsed.email, parsed.password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = refreshSchema.parse(req.body);

    const data = await refreshAccessToken(parsed.refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await logoutUser(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
