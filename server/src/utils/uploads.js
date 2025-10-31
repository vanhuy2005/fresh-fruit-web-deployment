import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Folder uploads/ đã được tạo tại: ${uploadDir}`);
} else {
  console.log(`Folder uploads/ đã tồn tại: ${uploadDir}`);
}

export default uploadDir;
