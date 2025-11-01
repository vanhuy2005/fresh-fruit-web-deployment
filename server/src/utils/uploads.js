import fs from "fs";
import path from "path";

let uploadDir = path.join(process.cwd(), "uploads");

// Chỉ tạo thư mục uploads khi không chạy trên production (Vercel)
if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Folder uploads/ đã được tạo tại: ${uploadDir}`);
  } else {
    console.log(`Folder uploads/ đã tồn tại: ${uploadDir}`);
  }
} else {
  // Trên Vercel, không tạo thư mục uploads, chỉ dùng Cloudinary hoặc lưu file tạm vào /tmp nếu cần
  uploadDir = "/tmp";
}

export default uploadDir;
