import multer from "multer";
import path from "path";
import uploadDir from "../utils/uploads.js";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExt = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedExt.test(ext) && mime.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ được upload ảnh (jpg, jpeg, png, webp)"));
    }
  },
});
