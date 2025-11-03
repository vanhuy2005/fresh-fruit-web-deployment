import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import {
  GENERAL_API,
  ADMIN_API,
  CART_API,
  ORDER_API,
} from "./src/utils/constants.js";
import { connectDB } from "./src/utils/db.js";
import userRoute from "./src/routes/user.route.js";
import adminRoute from "./src/routes/admin.route.js";
import cartRoute from "./src/routes/cart.route.js";
import orderRoute from "./src/routes/order.route.js";
import { connectCloudinary } from "./src/utils/cloudinary.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    `http://localhost:${process.env.PORT_FE || 5173}`,
    "https://fresh-fruit-web-deployment.vercel.app",
    "https://fresh-fruit-web-deployment-xsd7.vercel.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// main routes
app.use(GENERAL_API, userRoute);
app.use(ADMIN_API, adminRoute);
app.use(CART_API, cartRoute);
app.use(ORDER_API, orderRoute);

// connect DB + Cloudinary
Promise.all([connectDB(), connectCloudinary()])
  .then(() => console.log("✅ Connected to DB & Cloudinary"))
  .catch((err) => console.error("❌ Startup failed:", err?.message || err));

// Use app.listen() for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
