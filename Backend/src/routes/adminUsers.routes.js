import express from "express";
import {
  getUsers,
  deleteUser,
  getTotalUsersCount,
  contactMail,
} from "../controllers/adminUsers.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsers);

router.get("/getTotalUsersCount", verifyToken, getTotalUsersCount);

router.delete("/deleteUser/:id", verifyToken, deleteUser);

router.post("/contactMail", verifyToken, contactMail);

export default router;
