import User from "../../models/user.model";
import asyncHandler from "../../utils/asynHandler";
import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenActions";
import { CustomUser } from "../../middlewares/isAuth";
export const registerAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email, and password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "Account registered successfully",
      data: userResponse,
    });
  }
);

export const loginAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(404);
      throw new Error("Please provide email and password");
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    const validPassowrd = await user.matchPassword(password);
    if (!validPassowrd) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Prepare user response (without sensitive data)
    const userResponse = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    // Set cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: userResponse,
      });
  }
);

export const logoutAccount = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    // Get user ID from authenticated request (assuming auth middleware sets req.user)
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    // Clear cookies with same options used when setting them
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logout successful",
      });
  }
);
export const authcheck = async (
  req: CustomUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "User is not authenticated" });
    }

    const user = await User.findById(userId).select("-password"); // exclude password field
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    // If authenticated successfully
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user,
    });
  } catch (error) {
    next(error);
  }
};
