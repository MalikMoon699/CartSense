import express from "express";
import {
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductFromCart,
  emptyCart,
} from "../controllers/cartProducts.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getCart/:id", verifyToken, getCartById);
router.post("/addProductCart", verifyToken, addProductToCart);
router.delete("/removeProductCart/:productId", verifyToken, removeProductFromCart);
router.delete("/emptyCart/:userId", verifyToken, emptyCart);
router.put("/updateProductCart/:productId", verifyToken, updateProductFromCart);

export default router;
