import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asynHandler";
import User from "../models/user.model";
import { generateNewToken } from "../utils/tokenActions";

export interface CustomUser extends Request {
  user?: {
    userId: string;
    name: string;
    email: string;
    role: "customer" | "admin";
  };
}

export const authenticate = async (
  req: CustomUser,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken || null;
  const refreshToken = req.cookies?.refreshToken || null;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthenticated user" });
  }

  try {
    let decoded;

    if (accessToken) {
      // Try verifying access token
      decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
    } else {
      // No access token, try refresh token
      const newAccessToken = await generateNewToken(
        refreshToken,
        req,
        res,
        () => {}
      );

      if (!newAccessToken)
        return res
          .status(401)
          .json({ message: "Failed to generate new access token" });

      decoded = jwt.verify(
        newAccessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach user to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return next();
  } catch (error: any) {
    // Token expired
    if (error.name === "TokenExpiredError") {
      try {
        await generateNewToken(refreshToken, req, res, () => {});
        const newAccessToken = req.cookies?.accessToken;
        if (!newAccessToken)
          return res
            .status(401)
            .json({ message: "Failed to generate new access token" });

        const decoded = jwt.verify(
          newAccessToken,
          process.env.ACCESS_TOKEN_SECRET!
        ) as JwtPayload;
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };

        console.log("Token refreshed after expiration");
        return next();
      } catch {
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }
    }

    // Any other invalid token
    return res.status(401).json({ message: "Invalid access token" });
  }
};

export const authorization = (allowedRoles: string[]) => {
  return asyncHandler(
    async (req: CustomUser, res: Response, next: NextFunction) => {
      const userID = req.user?.userId;

      if (!userID) {
        res.status(401);
        throw new Error("User not authenticated");
      }

      const existingUser = await User.findById(userID);

      if (!existingUser) {
        res.status(401);
        throw new Error("User not found");
      }

      if (!allowedRoles.includes(existingUser.role)) {
        res.status(403);
        throw new Error("Unauthorized: Insufficient permissions");
      }

      next();
    }
  );
};
