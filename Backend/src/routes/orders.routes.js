import express from "express";
import {
  getOrdersById,
  getAllOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  getTotalOrdersCount,
  getTotalRevenue,
} from "../controllers/orders.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getOrder/:id", verifyToken, getOrdersById);
router.get("/getAllOrders", verifyToken, getAllOrders);
router.get("/getTotalOrdersCount", verifyToken, getTotalOrdersCount);
router.get("/getTotalRevenue", verifyToken, getTotalRevenue);
router.post("/createOrder", verifyToken, createOrder);
router.delete("/deleteOrder/:id", verifyToken, deleteOrder);
router.put("/updateOrder/:id", verifyToken, updateOrder);

export default router;
