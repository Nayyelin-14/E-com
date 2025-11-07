import jwt from "jsonwebtoken";
import { CustomUser } from "../middlewares/isAuth";
import { CookieOptions, NextFunction, Response } from "express";
import User from "../models/user.model";
export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" } // 15 minutes
  );
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" } // 7 days
  );
};

export const generateNewToken = async (
  oldRefreshToken: string,
  req: CustomUser,
  res: Response,
  next: NextFunction
) => {
  let decoded;
  try {
    decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: string };
  } catch (err: any) {
    next(err);
  }

  const user = await User.findById(decoded!.userId);
  if (!user) {
    res.status(404).json("User is not authenticated");
  }

  //if all ok , create new token
  const newAccessToken = generateAccessToken(decoded!.userId);
  const newRefreshToken = generateRefreshToken(decoded!.userId);

  const option: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };
  res
    .cookie("accessToken", newAccessToken, {
      ...option,
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", newRefreshToken, {
      ...option,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

  req.user = {
    userId: user?._id!.toString()!,
    email: user?.email!,
    name: user?.name!,
    role: user?.role!,
  };

  next();
};
