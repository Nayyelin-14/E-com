import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import streamifier from "streamifier";
interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  fileName: string;
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  fileName: string // 👈 this will become public_id
): Promise<CloudinaryUploadResult> => {
  console.log(fileBuffer, folder, fileName, "to cloud");
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        public_id: fileName, // ✅ use public_id to set the filename
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) {
          resolve({
            public_id: result.public_id,
            url: result.url,
            secure_url: result.secure_url,
            fileName: fileName,
          });
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    console.log("✅ Image deleted:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to delete image:", error);
    throw new Error("Cloudinary deletion failed");
  }
};
