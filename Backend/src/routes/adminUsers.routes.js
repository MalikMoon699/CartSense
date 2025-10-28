import express from "express";
import { getUsers, deleteUser } from "../controllers/adminUsers.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsers);

router.delete("/deleteUser/:id", verifyToken, deleteUser);

export default router;
