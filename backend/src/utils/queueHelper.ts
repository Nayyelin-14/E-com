import ImagesQueue from "../cacheActions/queues/imageQueue";

export const UploadProfileQueue = async (payload: {
  buffer: Buffer;
  fileName: string;
  userId: string;
  folder: string;
  width: number;
  height: number;
  quality: number;
}) => {
  console.log(payload);
  return await ImagesQueue.add(
    "ProfileUpload",
    {
      buffer: payload.buffer.toString("base64"),
      folder: payload.folder,
      fileName: payload.fileName,
      userId: payload.userId, // Add userId to job data
      width: payload.width,
      height: payload.height,
      quality: payload.quality,
    },
    {
      jobId: `Upload_${payload.userId}_profile`,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 1000 * 60 * 5,
      removeOnFail: 1000 * 60 * 10,
    }
  );
};

export const ProductImagesQueue = async (payload: {
  buffer: Buffer;
  fileName: string;
  userId: string;
  folder: string;
  width: number;
  height: number;
  quality: number;
  productId: string;
}) => {
  console.log(payload);
  return await ImagesQueue.add(
    "ProductImages",
    {
      buffer: payload.buffer.toString("base64"),
      folder: payload.folder,
      fileName: payload.fileName,
      productId: payload.productId,

      width: payload.width,
      height: payload.height,
      quality: payload.quality,
    },
    {
      jobId: `product_image_${payload.userId}_${
        payload.fileName
      }_${Date.now()}`,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 1000 * 60 * 5,
      removeOnFail: 1000 * 60 * 10,
    }
  );
};
