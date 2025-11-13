import express from "express";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  getCategories,
  updateCategories,
  addProduct,
  getSingleProducts,
  getSameCategoriesProducts,
  addProductReview,
  getTotalProductsCount,
  getAllProducts,
  deleteProductReview,
} from "../controllers/adminProducts.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/getProducts", getProducts);
router.get("/getAllProducts", getAllProducts);
router.get("/getTotalProductsCount", getTotalProductsCount);
router.get("/getSingleProducts/:id", getSingleProducts);
router.get("/getSameCategoriesProducts/:category", getSameCategoriesProducts);
router.get("/getcategories", getCategories);
router.post("/addProduct", verifyToken, upload.array("images", 10), addProduct);
router.post("/addReview/:id", verifyToken, addProductReview);
router.post("/deleteReview/:id", verifyToken, deleteProductReview);
router.put(
  "/updateProduct/:id",
  verifyToken,
  upload.array("images", 10),
  updateProduct
);
router.delete("/deleteProduct/:id", verifyToken, deleteProduct);
router.put("/updatecategories", verifyToken, updateCategories);

export default router;
