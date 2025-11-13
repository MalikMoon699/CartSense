// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  updateUserData,
  updatePassword,
  uploadProfileImage,
  forgetPassword,
  otpCheck,
  newPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/otp-check", otpCheck);
router.post("/new-password", newPassword);
router.get("/user", verifyToken, getUserData);
router.put("/updateUser/:id", verifyToken, uploadProfileImage, updateUserData);
router.put("/updateUserPassword/:id", verifyToken, updatePassword);


export default router;
