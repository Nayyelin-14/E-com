// workers/imageWorker.ts
import { Job, Worker } from "bullmq";
import sharp from "sharp";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../configs/cloudinary";
import { redisConnection } from "../../configs/redisClient";
import User from "../../models/user.model";
import { connectDB } from "../../db/connectDB";
import Product from "../../models/products.model";

connectDB()
  .then(() => console.log("✅ Worker connected to MongoDB"))
  .catch((err) => console.error("❌ Worker DB connection failed", err));
const imageWorker = new Worker(
  "ImageUploadQueue", // Queue name
  async (job: Job) => {
    console.log(`📸 Processing image job: ${job.id}`);

    if (job.name === "ProductImagesUpload") {
      const { fileName, folder, width, height, quality, buffer, productId } =
        job.data;
      const imageBuffer = Buffer.from(buffer, "base64");
      // optimize with sharp
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(width, height, { fit: "cover" }) // you can choose any size
        .webp({ quality, lossless: false })
        .toBuffer();

      const uploadResult = await uploadToCloudinary(
        optimizedBuffer,
        folder,
        fileName
      );
      if (uploadResult) {
        await Product.findByIdAndUpdate(
          productId,
          {
            $push: {
              images: {
                url: uploadResult.secure_url,
                public_alt: uploadResult.public_id,
              },
            },
          },
          { new: true } // optional: returns updated doc
        );
      }
    }
    if (job.name === "ProductImagesRemove") {
      const { public_alt, product_Id } = job.data;
      console.log(public_alt);
      // Delete from Cloudinary
      const deleteResult = await deleteFromCloudinary(public_alt);

      if (deleteResult.result === "ok") {
        // Remove the image from product.images array
        await Product.findByIdAndUpdate(
          product_Id,
          { $pull: { images: { public_alt: public_alt } } }, // remove the object matching public_alt
          { new: true }
        );
      }
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
