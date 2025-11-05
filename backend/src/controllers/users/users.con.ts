import { NextFunction, Response } from "express";
import { CustomUser } from "../../middlewares/isAuth";
import bcrypt from "bcryptjs";
import User from "../../models/user.model";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../configs/cloudinary";

import sharp from "sharp";
import { validationResult } from "express-validator";

export const uploadProfile = async (
  req: CustomUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user || !user.profileImage?.publicId) {
      return res.status(404).json({ message: "No image found" });
    }

    await deleteFromCloudinary(user.profileImage.publicId);

    user.profileImage = undefined;
    await user.save();
    const originalName = file.originalname.split(".")[0];
    const uniqueFileName = `${originalName}_${Date.now()}`;

    const optimizedBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: "cover" })
      .webp({ quality: 50 })
      .toBuffer();

    const cloudinaryResult = await uploadToCloudinary(
      optimizedBuffer,
      "profile",
      uniqueFileName
    );

    // Update user in MongoDB
    await User.findByIdAndUpdate(userId, {
      profileImage: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        alt: uniqueFileName,
      },
    });

    return res.status(200).json({
      message: "Profile uploaded successfully",
      imageUrl: cloudinaryResult.secure_url,
    });
  } catch (error: any) {
    console.error("❌ Failed to upload profile:", error);
    return res.status(500).json({
      message: "Failed to upload profile",
      error: error.message,
    });
  }
};

export const getUserInfo = async (
  req: CustomUser,
  res: Response,
  next: NextFunction
) => {
  const userId = req?.user?.userId;
  console.log(userId);
  const existedUser = await User.findById(userId).select("-password -_id ");
  if (!existedUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    user: existedUser,
  });
};

export const updateUserProfile = async (req: CustomUser, res: Response) => {
  try {
    const userId = req.user?.userId; // assuming your auth middleware sets req.user
    const { name, email } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user?.email === email) {
      return res.status(404).json({ message: "Email is already in use" });
    }
    // If neither field is provided
    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Please provide name or email to update" });
    }

    // Conditionally update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("❌ Update failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ChangePassword = async (req: CustomUser, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const userId = req.user?.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};
