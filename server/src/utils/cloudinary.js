import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = async () => {
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary envs: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  await cloudinary.api.ping();
  return true;
};

const uploadToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "products",
    });
    
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Lỗi khi xóa file tạm:", err);
      else console.log(`Đã xóa file tạm: ${imagePath}`);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Upload thất bại:", error);
    throw error;
  }
};

export { connectCloudinary, uploadToCloudinary };
