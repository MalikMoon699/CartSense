import express from "express";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  getCategories,
  updateCategories,
  addProduct,
} from "../controllers/adminProducts.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/getProducts", verifyToken, getProducts);
router.get("/getcategories", verifyToken, getCategories);
router.post("/addProduct", verifyToken, upload.array("images", 10), addProduct);
router.put(
  "/updateProduct/:id",
  verifyToken,
  upload.array("images", 10),
  updateProduct
);
router.delete("/deleteProduct/:id", verifyToken, deleteProduct);
router.put("/updatecategories", verifyToken, updateCategories);

export default router;
