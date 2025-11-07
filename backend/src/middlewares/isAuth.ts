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

export const authenticate = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    // Get token from cookies
    const accessToken = req.cookies?.accessToken || null;
    const refreshToken = req.cookies?.refreshToken || null;

    if (!refreshToken) {
      res.status(401);
      throw new Error("Unauthenticated User Detected");
    }

    try {
      // Try to verify access token first
      if (accessToken) {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as JwtPayload;

        // Find user by ID
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          res.status(401);
          throw new Error("User not found or has been deleted");
        }

        // Attach user to request object
        req.user = {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };

        return next(); // Important: return here
      } else {
        // No access token, try refresh token
        throw new jwt.JsonWebTokenError("No access token provided");
      }
    } catch (error: any) {
      // Handle token expiration or invalid token
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      ) {
        try {
          // Generate new access token using refresh token
          await generateNewToken(refreshToken, req, res, () => {});

          const newAccessToken = req.cookies?.accessToken;

          if (!newAccessToken) {
            res.status(401);
            throw new Error("Failed to generate new access token");
          }

          // Verify the new access token
          const decoded = jwt.verify(
            newAccessToken,
            process.env.ACCESS_TOKEN_SECRET!
          ) as JwtPayload;

          // Find user again with new token
          const user = await User.findById(decoded.userId).select("-password");

          if (!user) {
            res.status(401);
            throw new Error("User not found");
          }
          console.log("token refreshed");
          req.user = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };

          return next(); // Important: return here
        } catch (refreshError: any) {
          res.status(401);
          throw new Error("Invalid or expired refresh token");
        }
      }

      // Re-throw other errors
      throw error;
    }
  }
);

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
