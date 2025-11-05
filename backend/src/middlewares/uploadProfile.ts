// middleware/upload.ts
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!"));
  }
};

// Use memory storage for Cloudinary
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export default uploadMiddleware;
