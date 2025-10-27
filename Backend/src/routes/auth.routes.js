// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  updateUserData,
  updatePassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);
router.put("/updateUser/:id", verifyToken, updateUserData);
router.put("/updateUserPassword/:id", verifyToken, updatePassword);


export default router;
