import UploadPhotoQueue from "../cacheActions/queues/imageQueue";

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
  return await UploadPhotoQueue.add(
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

export default UploadPhotoQueue;
