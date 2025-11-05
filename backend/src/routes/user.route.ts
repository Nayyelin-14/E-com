import express from "express";

import { authenticate } from "../middlewares/isAuth";
import {
  ChangePassword,
  getUserInfo,
  updateUserProfile,
  uploadProfile,
} from "../controllers/users/users.con";
import uploadMiddleware from "../middlewares/uploadProfile";
import { PasswordValidator, ProfleUpdateValidator } from "../utils/validations";

const router = express.Router();
router.post(
  "/user/upload-profile",
  authenticate,
  uploadMiddleware.single("profileImage"),
  uploadProfile
);

router.get("/user/info", authenticate, getUserInfo);
router.post(
  "/user/update-profile",
  authenticate,
  ProfleUpdateValidator,
  updateUserProfile
);

router.post(
  "/user/change-password",
  authenticate,
  PasswordValidator,
  ChangePassword
);
export default router;
