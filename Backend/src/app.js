import { PORT } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import adminUsersRoutes from "./routes/adminUsers.routes.js";
import adminProductsRoutes from "./routes/adminProducts.routes.js";
import cartRoutes from "./routes/cartProducts.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import connectToDB from "./database/mongodb.js";

connectToDB();
const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/adminUser", adminUsersRoutes);
app.use("/api/adminProduct", adminProductsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
