import express from "express";

import { authenticate } from "../middlewares/isAuth";

import { checkJobStatus } from "../controllers/Jobs.con";
const router = express.Router();

router.get("/status/:jobId", authenticate, checkJobStatus);
export default router;
