// workers/imageWorker.ts
import { Job, Worker } from "bullmq";
import sharp from "sharp";
import { uploadToCloudinary } from "../../configs/cloudinary";
import { redisConnection } from "../../configs/redisClient";
import User from "../../models/user.model";
import { connectDB } from "../../db/connectDB";

connectDB()
  .then(() => console.log("✅ Worker connected to MongoDB"))
  .catch((err) => console.error("❌ Worker DB connection failed", err));
const imageWorker = new Worker(
  "ProfileUploadQueue", // Queue name
  async (job: Job) => {
    console.log(`📸 Processing image job: ${job.id}`);

    if (job.name === "ProfileUpload") {
      const { fileName, folder, width, height, quality, buffer, userId } =
        job.data;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

console.log("✅ Image worker is running");

imageWorker.on("completed", (job) => {
  console.log(`✅ Image job ${job!.id} completed`);
});

imageWorker.on("failed", (job, error) => {
  console.log(`❌ Image job ${job!.id} failed: ${error.message}`);
});

export default imageWorker;
